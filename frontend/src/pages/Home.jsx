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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl mb-8">Connect with top employers and discover opportunities</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/jobs"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Jobs</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <div key={job.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-500 mb-4">{job.location}</p>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No featured jobs available</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

