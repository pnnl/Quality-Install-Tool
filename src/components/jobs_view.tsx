import React, { useState } from 'react';

interface Job {
  id: number;
  name: string;
  dbName: string;
}

interface JobListProps {
  dbName: string;
}

const JobsView: React.FC<JobListProps> = ({ dbName }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleDeleteJob = (id: number) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
  };

  const handleAddJob = () => {
    const name = prompt('Enter job name');
    if (name !== null) {
      const isDuplicate = jobs.some(job => job.name === name);
      if (!isDuplicate) {
        const newJob: Job = {
          id: Date.now(),
          name,
          dbName
        };
        setJobs(prevJobs => [...prevJobs, newJob]);
      } else {
        alert('Job name already exists');
      }
    }
  };


  const handleRenameJob = (id: number) => {
    const newName = prompt('Enter new name');
    if (newName !== null) {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.id === id) {
            return { ...job, name: newName };
          }
          return job;
        })
      );
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => b.id - a.id);

  return (
    <div>
      <h1>Job List for DB: {dbName}</h1>
      <ul>
        {sortedJobs.map(job => (
          <li key={job.id}>
            {job.name}{' '}
            <button onClick={() => handleDeleteJob(job.id)}>Delete</button>{' '}
            <button><a href={`/app/${dbName}/${job.name}`}>Open</a></button>
            <button onClick={() => handleRenameJob(job.id)}>Rename</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddJob}>Add Job</button>
    </div>
  );
};

export default JobsView;
