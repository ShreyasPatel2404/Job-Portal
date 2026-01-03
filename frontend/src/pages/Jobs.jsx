import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';

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
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 mb-2">{job.location}</p>
                <p className="text-sm text-gray-400 mb-4">{job.jobType}</p>
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">No jobs found</div>
      )}
    </div>
  );
};

export default Jobs;

