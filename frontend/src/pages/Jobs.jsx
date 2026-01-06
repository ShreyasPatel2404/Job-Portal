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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
            Browse roles
          </h1>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Filter by location, type, and category. Match scores will appear as AI signals are
            available for each role.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-white/80 p-4 text-sm shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Job filters"
        >
          <div>
            <label
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-200"
              htmlFor="location"
            >
              Location
            </label>
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-950">
              <MapPin className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              <input
                id="location"
                type="text"
                name="location"
                placeholder="City, country, or remote"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border-none bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-200"
              htmlFor="jobType"
            >
              Job type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="block w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100"
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
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-200"
              htmlFor="category"
            >
              Category
            </label>
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-950">
              <Briefcase className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              <input
                id="category"
                type="text"
                name="category"
                placeholder="e.g. Frontend, Product, Data"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border-none bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="py-10 text-center text-xs text-gray-500 dark:text-gray-300 animate-pulse">
          Loading roles...
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              const matchScore = job.matchScore || job.aiMatchScore;
              return (
                <div
                  key={job.id}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 text-xs shadow-sm transition hover:border-primary-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  tabIndex={0}
                  aria-label={`Job: ${job.title} at ${job.company}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                        {job.company}
                      </p>
                    </div>
                    {matchScore != null && (
                      <Badge
                        variant={matchScore >= 85 ? 'success' : 'secondary'}
                        className="shrink-0 text-[10px]"
                      >
                        <Sparkles className="mr-1 h-3 w-3" aria-hidden="true" />
                        Match {matchScore}%
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {job.location}
                    </span>
                    {job.jobType && (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3 w-3" aria-hidden="true" />
                        {job.jobType}
                      </span>
                    )}
                  </div>
                  {matchScore != null && (
                    <div className="mt-3">
                      <Progress value={matchScore} />
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
                    >
                      View details
                    </Link>
                    {isAuthenticated && (
                      savedJobIds.includes(job.id) ? (
                        <button
                          className="text-[11px] font-medium text-red-600 hover:underline"
                          onClick={async () => {
                            await savedJobService.unsaveJob(job.id);
                            fetchSavedJobs();
                          }}
                        >
                          Unsave
                        </button>
                      ) : (
                        <button
                          className="text-[11px] font-medium text-primary-600 hover:underline dark:text-primary-300"
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
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 transition hover:bg-primary-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-xs text-gray-700 dark:text-gray-200">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 transition hover:bg-primary-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-10 text-center text-xs text-gray-500 dark:text-gray-400">
          No jobs found. Try adjusting your filters or broadening your search.
        </div>
      )}
    </div>
  );
};

export default Jobs;

