import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import CompanyReviews from './pages/CompanyReviews';
import SavedJobs from './pages/SavedJobs';
import Notifications from './components/common/Notifications';
import ResumeManager from './pages/dashboard/ResumeManager';
import EmployerApplications from './pages/dashboard/EmployerApplications';
import Applications from './pages/Applications';
import JobPost from './pages/JobPost';
import EmployerJobs from './pages/dashboard/EmployerJobs';
import ResumeDatabase from './pages/dashboard/ResumeDatabase'; // NEW
import InterviewScheduler from './pages/dashboard/InterviewScheduler'; // NEW
import Profile from './pages/Profile'; // NEW
import JobMatch from './components/jobs/JobMatch';

import ResumeBuilderEmbed from './pages/dashboard/ResumeBuilderEmbed.jsx';

import AdminDashboard from './pages/dashboard/AdminDashboard';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard';
import Dashboard from './pages/Dashboard';

// Layout
// Layout

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import VerifyEmail from './pages/VerifyEmail';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';

import { ToastProvider } from './components/ui/toast';

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // For now, we only visually toggle the mobile nav trigger; a full mobile drawer
  // can be added without changing page contracts.

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route
                path="/jobs/match"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <JobMatch />
                  </ProtectedRoute>
                }
              />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<RequestPasswordReset />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Company Reviews Route (all users) */}
              <Route path="/companies/:companyId/reviews" element={<CompanyReviews />} />

              {/* Saved Jobs Route (all authenticated users) */}
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute>
                    <SavedJobs />
                  </ProtectedRoute>
                }
              />

              {/* Notifications Route (all authenticated users) */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {/* Profile Route (all authenticated users) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Job Seeker Resume Management Route */}
              <Route
                path="/dashboard/jobseeker/resumes"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <ResumeManager />
                  </ProtectedRoute>
                }
              />

              {/* Job Seeker Resume Builder Route (powered by embedded project) */}
              <Route
                path="/dashboard/jobseeker/resume-builder"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <ResumeBuilderEmbed />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Resume Database Route */}
              <Route
                path="/dashboard/resumes"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <ResumeDatabase />
                  </ProtectedRoute>
                }
              />

              {/* Employer Applications Management Route */}
              <Route
                path="/dashboard/recruiter/applications"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerApplications />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Interview Scheduler Route */}
              <Route
                path="/dashboard/recruiter/interviews"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <InterviewScheduler />
                  </ProtectedRoute>
                }
              />

              {/* Job Seeker Applications Route */}
              <Route
                path="/applications"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <Applications />
                  </ProtectedRoute>
                }
              />

              {/* Employer Job Post Route */}
              <Route
                path="/jobs/post"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <JobPost />
                  </ProtectedRoute>
                }
              />

              {/* Employer Job Edit Route */}
              <Route
                path="/jobs/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <JobPost />
                  </ProtectedRoute>
                }
              />

              {/* Employer Jobs List Route */}
              <Route
                path="/jobs/my-jobs"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER']}>
                    <EmployerJobs />
                  </ProtectedRoute>
                }
              />

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
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
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

              {/* Settings Route */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['APPLICANT']}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

