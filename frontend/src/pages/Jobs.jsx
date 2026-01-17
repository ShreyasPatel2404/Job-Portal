import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Sparkles, Filter, Search, Bookmark } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Header */}
        <div className="relative pt-32 pb-12 bg-gray-50 dark:bg-zinc-950/50 border-b border-border">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm">Browse Opportunities</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Find your next role
            </h1>
            <p className="text-lg text-muted-foreground">
              Filter by location, type, and category. Match scores will appear as AI signals are available.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          {/* Filters */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-xl p-6 mb-10">
            <form
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="location"
                    placeholder="City, country, or remote"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all group-hover:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Job type
                </label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">All types</option>
                    <option value="full-time">Full time</option>
                    <option value="part-time">Part time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                  <Filter className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" /> Category
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Frontend, Product"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all group-hover:border-primary/50"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Finding the best matches...</p>
            </div>
          ) : jobs.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {jobs.map((job) => {
                const matchScore = job.matchScore || job.aiMatchScore;
                const isSaved = savedJobIds.includes(job.id);

                return (
                  <motion.div
                    key={job.id}
                    variants={item}
                    className="group relative flex flex-col rounded-xl border border-border bg-card hover:bg-card/90 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <Badge variant="secondary" className="mb-2">{job.jobType || 'Full-time'}</Badge>
                          <Link to={`/jobs/${job.id}`}>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                              {job.title}
                            </h3>
                          </Link>
                          <p className="text-sm font-medium text-muted-foreground">
                            {job.company}
                          </p>
                        </div>
                        {matchScore != null && (
                          <div className="flex flex-col items-center">
                            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${matchScore >= 85 ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20' : 'border-primary text-primary bg-primary/5'}`}>
                              <span className="text-xs font-bold">{matchScore}%</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1">Match</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                          {job.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            View Details
                          </Link>

                          {isAuthenticated && (
                            <button
                              onClick={async () => {
                                if (isSaved) {
                                  await savedJobService.unsaveJob(job.id);
                                } else {
                                  await savedJobService.saveJob(job.id);
                                }
                                fetchSavedJobs();
                              }}
                              className={`p-2 rounded-full transition-colors ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary'}`}
                            >
                              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or broadening your search.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};


export default Jobs;

