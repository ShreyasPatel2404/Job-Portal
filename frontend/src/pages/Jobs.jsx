import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    category: '',
  });
  const { isAuthenticated } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs(page, 10, filters);
      setJobs(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated) fetchSavedJobs();
    // eslint-disable-next-line
  }, [fetchJobs, isAuthenticated]);

  const fetchSavedJobs = async () => {
    try {
      const data = await savedJobService.getSavedJobs();
      setSavedJobIds(data.map(j => j.id));
    } catch {
      setSavedJobIds([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Browse Jobs</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow mb-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={e => e.preventDefault()} aria-label="Job filters">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Enter location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-zinc-900 dark:text-white transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-zinc-900 dark:text-white transition"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              placeholder="Enter category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-zinc-900 dark:text-white transition"
              autoComplete="off"
            />
          </div>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading jobs...</div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition group focus-within:ring-2 focus-within:ring-primary-400"
                tabIndex={0}
                aria-label={`Job: ${job.title} at ${job.company}`}
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
                <p className="text-gray-500 dark:text-gray-400 mb-2">{job.location}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{job.jobType}</p>
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold focus:underline"
                >
                  View Details →
                </Link>
                {isAuthenticated && (
                  savedJobIds.includes(job.id) ? (
                    <button
                      className="ml-4 text-red-600 hover:underline"
                      onClick={async () => {
                        await savedJobService.unsaveJob(job.id);
                        fetchSavedJobs();
                      }}
                    >
                      Unsave
                    </button>
                  ) : (
                    <button
                      className="ml-4 text-primary-600 hover:underline"
                      onClick={async () => {
                        await savedJobService.saveJob(job.id);
                        fetchSavedJobs();
                      }}
                    >
                      Save
                    </button>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition disabled:opacity-50"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-200">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No jobs found</div>
      )}
    </div>
  );
};

export default Jobs;

