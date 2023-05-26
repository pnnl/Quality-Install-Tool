import React, { ReactNode, useEffect, useState } from 'react';
import PouchDB from 'pouchdb'
import PouchDBUpsert from 'pouchdb-upsert'
import { result } from 'lodash';

PouchDB.plugin(PouchDBUpsert);


interface Job {
  children: ReactNode;
  dbName: string,
  docId: string,
}

interface JobListProps {
  dbName: string;
}

const JobList: React.FC<JobListProps> = ({ dbName }) => {
  const db = new PouchDB(dbName);
  const [sortedJobs, setSortedJobs] = useState<string[]>([]);

  useEffect(() => {
    const retrieveJobs = async () => {
      try {
        const result = await db.allDocs({ include_docs: true });
        const sortedJobs = result.rows.map(row => row.id);
        setSortedJobs(sortedJobs);
      } catch (error) {
        console.error('Error retrieving jobs:', error);
      }
    };

    retrieveJobs();
  });

  const handleDeleteJob = async (jobId: string) => {
    try {
      const doc = await db.get(jobId);
      await db.remove(doc);
      // Refresh the job list after deletion
      const result = await db.allDocs({ include_docs: true });
      const sortedJobs = result.rows.map(row => row.id);
      setSortedJobs(sortedJobs);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleAddJob = async () => {
    // adding a new job here
    const name = prompt('Enter job name');
    if (name !== null) {
      await db.putIfNotExists(name, {})
    }
    // Refresh the job list after adding the new job
    const result = await db.allDocs({ include_docs: true });
    const sortedJobs = result.rows.map(row => row.id);
    setSortedJobs(sortedJobs);
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
      const result = await db.allDocs({ include_docs: true });
      const sortedJobs = result.rows.map(row => row.id);
      setSortedJobs(sortedJobs);
    } catch (error) {
      console.error('Error renaming job:', error);
    }
  };

  return (
    <div>
      <h1>Job List for DB: {dbName}</h1>
      <ul>
        {sortedJobs.map(job => (
          <li>
            {job}{' '}
            <button onClick={() => handleDeleteJob(job)}>Delete</button>{' '}
            <button><a href={`/app/${dbName}/${job}`}>Open</a></button>
            <button onClick={() => handleRenameJob(job)}>Rename</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddJob}>Add Job</button>
    </div>
  );
};

export default JobList;
