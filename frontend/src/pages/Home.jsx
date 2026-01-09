import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { motion } from 'framer-motion';
import { Search, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const jobs = await jobService.getFeaturedJobs();
        setFeaturedJobs(jobs || []);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Hero + search */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-100/40 py-16 sm:py-20 lg:py-24 backdrop-blur-md dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/50 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-50">
              Find your next
              <span className="block text-primary-600 dark:text-primary-400 mt-2">
                career opportunity
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover roles that match your skills and career goals
            </p>

            {/* Search form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="mt-8 max-w-2xl mx-auto"
              aria-label="Job search"
            >
              <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex-1 flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-gray-700 ring-1 ring-slate-200 transition-shadow focus-within:ring-2 focus-within:ring-primary-500 dark:bg-zinc-950 dark:text-gray-100 dark:ring-zinc-800">
                  <Search className="h-5 w-5 text-gray-400 shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Job title, skills, or company"
                    className="w-full border-none bg-transparent text-base outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-gray-700 ring-1 ring-slate-200 transition-shadow focus-within:ring-2 focus-within:ring-primary-500 dark:bg-zinc-950 dark:text-gray-100 dark:ring-zinc-800 sm:w-48">
                  <Building2 className="h-5 w-5 text-gray-400 shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full border-none bg-transparent text-base outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 whitespace-nowrap"
                >
                  Search Jobs
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
              Featured Opportunities
            </h2>
          </div>
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.slice(0, 6).map((job) => (
                <Card
                  key={job.id}
                  className="transition-all duration-200 hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-50 line-clamp-2">
                      {job.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                      {job.company}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400">{job.location}</p>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-base font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 transition-colors mt-2"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && featuredJobs.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-300 transition-colors"
              >
                View all jobs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;

