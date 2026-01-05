import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30 dark:opacity-20" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" fillOpacity=".2" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">Find Your Dream Job</h1>
          <p className="text-xl md:text-2xl mb-8 font-medium animate-fade-in delay-100">Connect with top employers and discover opportunities</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in delay-200">
            <Link
              to="/jobs"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-primary-400 focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Featured Jobs</h2>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-300 animate-pulse">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition group focus-within:ring-2 focus-within:ring-primary-400"
                  tabIndex={0}
                  aria-label={`Featured job: ${job.title} at ${job.company}`}
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{job.location}</p>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold focus:underline"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No featured jobs available</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

