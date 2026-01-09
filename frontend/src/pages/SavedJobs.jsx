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
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Saved Jobs</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Your bookmarked job opportunities
        </p>
      </div>
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading saved jobs...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div 
              key={job.id} 
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-700"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                {job.title}
              </h3>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {job.company}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400 mb-1">
                {job.location}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                {job.jobType}
              </p>
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <Link 
                  to={`/jobs/${job.id}`} 
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                >
                  View Details
                  <span className="ml-1" aria-hidden="true">→</span>
                </Link>
                <button 
                  onClick={() => handleUnsave(job.id)} 
                  className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  aria-label={`Unsave ${job.title}`}
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-md px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
              No saved jobs
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start saving jobs you're interested in to view them here later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
