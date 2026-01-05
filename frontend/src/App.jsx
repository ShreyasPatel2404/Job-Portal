import CompanyReviews from './pages/CompanyReviews';
import SavedJobs from './pages/SavedJobs';
            {/* Saved Jobs Route (all authenticated users) */}
            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
import Notifications from './components/common/Notifications';
            {/* Notifications Route (all authenticated users) */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
import ResumeManager from './pages/dashboard/ResumeManager';
            {/* Job Seeker Resume Management Route */}
            <Route
              path="/dashboard/jobseeker/resumes"
              element={
                <ProtectedRoute allowedRoles={['APPLICANT']}>
                  <ResumeManager />
                </ProtectedRoute>
              }
            />
import EmployerApplications from './pages/dashboard/EmployerApplications';
            {/* Employer Applications Management Route */}
            <Route
              path="/dashboard/recruiter/applications"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerApplications />
                </ProtectedRoute>
              }
            />
import Applications from './pages/Applications';
            {/* Job Seeker Applications Route */}
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['APPLICANT']}>
                  <Applications />
                </ProtectedRoute>
              }
            />
import JobPost from './pages/JobPost';
            {/* Employer Job Post Route */}
            <Route
              path="/jobs/post"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <JobPost />
                </ProtectedRoute>
              }
            />
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import VerifyEmail from './pages/VerifyEmail';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<RequestPasswordReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Company Reviews Route (all users) */}
            <Route path="/companies/:companyId/reviews" element={<CompanyReviews />} />

            {/* Role-based Dashboards */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/recruiter"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/jobseeker"
              element={
                <ProtectedRoute allowedRoles={['APPLICANT']}>
                  <JobSeekerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

