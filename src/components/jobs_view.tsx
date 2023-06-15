import React, { ReactNode, useEffect, useState } from 'react';
import { TfiTrash, TfiPlus, TfiPencil, TfiFilter } from "react-icons/tfi";
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import { Button, ListGroup } from 'react-bootstrap';
import templatesConfig from '../templates/templates_config'
import InputModal from './prompt_box';

PouchDB.plugin(PouchDBUpsert);

interface JobListProps {
  dbName: string;
}

const JobList: React.FC<JobListProps> = ({ dbName }) => {
  const db = new PouchDB(dbName);
  const [sortedJobs, setSortedJobs] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalOpenMap, setModalOpenMap] = useState<{ [jobId: string]: boolean }>({});


  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const retrieveJobs = async () => {
    try {
      const result = await db.allDocs({ include_docs: true });
      const jobsList = result.rows.map(row => row.doc);
      setJobsList(jobsList);
      sortByEditTime(jobsList);
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

  const handleAddJob = async (input : string) => {
    // adding a new job here
    const name = input;
    if (name !== null) {
      const date = new Date();
      await db.putIfNotExists(name, {meta_:{created_at: date, last_modified_at: date}})
    }
    // Refresh the job list after adding the new job
    await retrieveJobs();
  };


  const handleRenameJob = async (input : string, jobId: string) => {
    try {
      const newName = input;
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
        <Button onClick={openAddModal}><TfiPlus/></Button>
        <InputModal
          isOpen={isAddModalOpen}
          closeModal={closeAddModal}
          onSubmit={handleAddJob}
          title="Enter a name"
        />
        <div style={{ marginBottom: '10px' }}></div>
      {/* Sort feature, not used now but will be used in future. */ 
      /* <Dropdown>
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
      </Dropdown> */}
          
      </span>
        {sortedJobs.map(job => (
          <ListGroup.Item action href={`/app/${dbName}/${job}`}>
          {job}{' '}
          <span className="icon-container">
          
          <Button onClick={event => {
        event.preventDefault();
        setModalOpenMap(prevState => ({
          ...prevState,
          [job]: true,
        }));
      }}>
        Rename
      </Button>
          <InputModal
        isOpen={modalOpenMap[job] || false}
        closeModal={() => {
          setModalOpenMap(prevState => ({
            ...prevState,
            [job]: false,
          }));
        }}
        onSubmit={(input) => handleRenameJob(input, job)}
        title = "Enter a new name"
      />
      <Button onClick={event => {
            event.preventDefault();
            handleDeleteJob(job);
          }}><TfiTrash/></Button>
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
    
    </div>
  );
};

export default JobList;
