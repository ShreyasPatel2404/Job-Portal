import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Browse roles
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Filter by location, type, and category. Match scores will appear as AI signals are
          available for each role.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Job filters"
        >
          <div>
            <label
              className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="location"
            >
              Location
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 transition-shadow focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                id="location"
                type="text"
                name="location"
                placeholder="City, country, or remote"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border-none bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-900 dark:text-white"
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="jobType"
            >
              Job type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100 transition-shadow cursor-pointer"
            >
              <option value="">All types</option>
              <option value="full-time">Full time</option>
              <option value="part-time">Part time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
              htmlFor="category"
            >
              Category
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 transition-shadow focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
              <Briefcase className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                id="category"
                type="text"
                name="category"
                placeholder="e.g. Frontend, Product, Data"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border-none bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-900 dark:text-white"
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading roles...</p>
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              const matchScore = job.matchScore || job.aiMatchScore;
              return (
                <div
                  key={job.id}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-700"
                  tabIndex={0}
                  role="article"
                  aria-label={`Job: ${job.title} at ${job.company}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-300">
                        {job.company}
                      </p>
                    </div>
                    {matchScore != null && (
                      <Badge
                        variant={matchScore >= 85 ? 'success' : 'secondary'}
                        className="shrink-0 text-xs"
                      >
                        <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                        {matchScore}%
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-base text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{job.location}</span>
                    </span>
                    {job.jobType && (
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{job.jobType}</span>
                      </span>
                    )}
                  </div>
                  {matchScore != null && (
                    <div className="mt-4">
                      <Progress value={matchScore} />
                    </div>
                  )}
                  <div className="mt-5 flex items-center justify-between gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 transition-colors"
                    >
                      View details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    {isAuthenticated && (
                      savedJobIds.includes(job.id) ? (
                        <button
                          className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          onClick={async () => {
                            await savedJobService.unsaveJob(job.id);
                            fetchSavedJobs();
                          }}
                          aria-label={`Unsave ${job.title}`}
                        >
                          Unsave
                        </button>
                      ) : (
                        <button
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 transition-colors"
                          onClick={async () => {
                            await savedJobService.saveJob(job.id);
                            fetchSavedJobs();
                          }}
                          aria-label={`Save ${job.title}`}
                        >
                          Save
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page <span className="font-semibold">{page + 1}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
              No jobs found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters or broadening your search.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

