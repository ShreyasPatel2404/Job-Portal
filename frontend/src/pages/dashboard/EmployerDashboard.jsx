import { Link } from 'react-router-dom';
import React from 'react';

const EmployerDashboard = () => (
  <div className="container mx-auto py-10">
    <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
    <p className="mb-4">Post jobs, manage company profile, and view applicants here.</p>
    <div className="space-y-4">
      <Link to="/dashboard/recruiter/applications" className="inline-block bg-primary-600 text-white px-6 py-3 rounded shadow hover:bg-primary-700 transition">
        View Applications for My Jobs
      </Link>
    </div>
    {/* Add employer controls here */}
  </div>
);

export default EmployerDashboard;
