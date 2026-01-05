import React, { useEffect, useState } from 'react';
import { savedJobService } from '../services/savedJobService';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const data = await savedJobService.getSavedJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    await savedJobService.unsaveJob(jobId);
    fetchSavedJobs();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Saved Jobs</h1>
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading saved jobs...</div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{job.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
              <p className="text-gray-500 dark:text-gray-400 mb-2">{job.location}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{job.jobType}</p>
              <Link to={`/jobs/${job.id}`} className="text-primary-600 hover:text-primary-700 font-semibold focus:underline">View Details →</Link>
              <button onClick={() => handleUnsave(job.id)} className="ml-4 text-red-600 hover:underline">Unsave</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No saved jobs</div>
      )}
    </div>
  );
};

export default SavedJobs;
