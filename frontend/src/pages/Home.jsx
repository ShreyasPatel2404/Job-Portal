import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { motion } from 'framer-motion';
import { Search, Sparkles, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
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

  const categories = [
    'Engineering',
    'Product',
    'Data & AI',
    'Design',
    'Marketing',
    'Remote-first',
  ];

  const companies = ['Northwind Labs', 'Contoso AI', 'Fabrikam Cloud', 'Tailspin Studio'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Hero + search */}
      <section className="border-b border-gray-200 bg-white/80 py-10 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-50"
            >
              AI-first hiring for
              <span className="block text-primary-600 dark:text-primary-400">
                modern teams & careers.
              </span>
            </motion.h1>
            <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300">
              Search roles across top startups and enterprises. Our AI ranks opportunities
              by skill match and career trajectory, not just keywords.
            </p>

            {/* Search form (stubbed to jobs listing) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80"
              aria-label="Job search"
            >
              <div className="grid gap-2 sm:grid-cols-[2fr,1.5fr,auto]">
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-950 dark:text-gray-100 dark:ring-zinc-800">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search by title, skill, or company"
                    className="w-full border-none bg-transparent text-xs outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-950 dark:text-gray-100 dark:ring-zinc-800">
                  <Building2 className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Location or Remote"
                    className="w-full border-none bg-transparent text-xs outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary-700"
                >
                  Find roles
                </Link>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Trending searches:{' '}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Senior React • Java + Spring Boot • Remote Product Manager
                </span>
              </p>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Trusted by teams at
              {companies.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-zinc-900 dark:text-gray-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-4 w-full max-w-md space-y-3 rounded-2xl border border-gray-200 bg-white p-4 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:mt-0"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Powered by AI
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Match quality score live
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-50">
                Smart matching engine
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-300">
                We weigh skills, seniority, and growth preferences to surface roles that are
                realistically achievable and career-advancing.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular categories */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Popular categories
          </h2>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
          >
            Explore all roles
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className="cursor-pointer border-dashed hover:border-primary-400 hover:text-primary-700 dark:hover:border-primary-600 dark:hover:text-primary-300"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Featured opportunities
          </h2>
        </div>
        {loading ? (
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-300 animate-pulse">
            Loading featured roles...
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:border-primary-200 hover:shadow-md dark:hover:border-primary-700"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start justify-between gap-2 text-sm">
                      <span className="line-clamp-2 text-gray-900 dark:text-gray-50">
                        {job.title}
                      </span>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        Featured
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {job.company}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">{job.location}</p>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
                    >
                      View details
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                No featured jobs available yet. New curated roles will appear here as they’re
                added.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

