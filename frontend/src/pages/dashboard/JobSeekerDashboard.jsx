import React from 'react';
import { Link } from 'react-router-dom';

const JobSeekerDashboard = () => (
  <div className="container mx-auto py-10">
    <h1 className="text-3xl font-bold mb-6">Job Seeker Dashboard</h1>
    <p className="mb-4">Track your applications, saved jobs, and profile here.</p>
    <div className="space-y-4">
      <Link to="/dashboard/jobseeker/resumes" className="inline-block bg-primary-600 text-white px-6 py-3 rounded shadow hover:bg-primary-700 transition">
        Manage My Resumes
      </Link>
    </div>
    {/* Add job seeker controls here */}
  </div>
);

export default JobSeekerDashboard;
