import React, { ReactNode, useEffect, useState } from 'react';
import { TfiTrash, TfiPlus, TfiPencil, TfiFilter } from "react-icons/tfi";
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import { Button, ListGroup } from 'react-bootstrap';
import templatesConfig from '../templates/templates_config'
import Dropdown from 'react-bootstrap/Dropdown';
import {LinkContainer} from 'react-router-bootstrap'

PouchDB.plugin(PouchDBUpsert);

interface JobListProps {
  dbName: string;
}

const JobList: React.FC<JobListProps> = ({ dbName }) => {
  const db = new PouchDB(dbName);
  const [sortedJobs, setSortedJobs] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);

  const retrieveJobs = async () => {
    try {
      const result = await db.allDocs({ include_docs: true });
      //console.log(result.rows.map(row => row));
      const jobsList = result.rows.map(row => row.doc);
      setJobsList(jobsList);
      let sortedJobs = jobsList.map(doc => doc._id)
      setSortedJobs(sortedJobs);
      console.log(sortedJobs)
    } catch (error) {
      console.error('Error retrieving jobs:', error);
    }
  }

    useEffect(() => {
      retrieveJobs();
    }, []);


  const sortByCreateTime = (jobsList: any[]) =>{
      const sortedJobsByCreateTime = jobsList.sort((a, b) => {
        if(a.meta_.created_at.toString() < b.meta_.created_at.toString()){
          return 1;
        } 
        else if(a.meta_.created_at.toString() > b.meta_.created_at.toString()){
          return -1;
        } else {
          return 0;
        }
      });
      setSortedJobs(sortedJobsByCreateTime.map(doc => doc._id));
  }

  const sortByEditTime = (jobsList: any[]) =>{
    const sortedJobsByEditTime = jobsList.sort((a, b) => {
        if(a.meta_.last_modified_at.toString() < b.meta_.last_modified_at.toString()){
          return 1;
        } 
        else if(a.meta_.last_modified_at.toString() > b.meta_.last_modified_at.toString()){
          return -1;
        } else {
          return 0;
        }
      });
      setSortedJobs(sortedJobsByEditTime.map(doc => doc._id));
  }
  

  const handleDeleteJob = async (jobId: string) => {
    try {
      const doc = await db.get(jobId);
      await db.remove(doc);
      // Refresh the job list after deletion
      await retrieveJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleAddJob = async () => {
    // adding a new job here
    const name = prompt('Enter job name');
    if (name !== null) {
      const date = new Date();
      await db.putIfNotExists(name, {meta_:{created_at: date, last_modified_at: date}})
    }
    // Refresh the job list after adding the new job
    await retrieveJobs();
  };


  const handleRenameJob = async (jobId: string) => {
    try {
      const newName = prompt('Enter new name');
      if (newName !== null) {
        const doc = await db.get(jobId);
        await db.remove(doc); // Remove the existing document
        doc._id = newName; // Set the new name as the ID
        await db.putIfNotExists(doc);
      }
      
      // Refresh the job list after renaming
      await retrieveJobs();
    } catch (error) {
      console.error('Error renaming job:', error);
    }
  };

  return (
    <div className="container">
      <h1>{templatesConfig[dbName].title} Installation</h1>
      <ListGroup>
      <span className="icon-container">
        <Button onClick={handleAddJob}><TfiPlus/></Button>
      <Dropdown>
        <Dropdown.Toggle variant="success">
          <TfiFilter/>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={event => {sortByCreateTime(jobsList)}}>
            Sort By Created Date
          </Dropdown.Item>
          <Dropdown.Item onClick={event => {sortByEditTime(jobsList)}}>
            Sort By Edit Date
          </Dropdown.Item> 
        </Dropdown.Menu>
      </Dropdown>
          
      </span>
        {sortedJobs.map(job => (
          <LinkContainer to={`/app/${dbName}/${job._id}`}>
            <ListGroup.Item>
              {job}{' '}
              <span className="icon-container">
              <Button onClick={event => {
                event.preventDefault();
                handleDeleteJob(job);
              }}><TfiTrash/></Button>
              <Button onClick={event => {
                event.preventDefault();
                handleRenameJob(job);}}><TfiPencil/>
              </Button>
              </span>
            </ListGroup.Item>
          </LinkContainer>
      ))}
    </ListGroup>
    
    </div>
  );
};

export default JobList;
