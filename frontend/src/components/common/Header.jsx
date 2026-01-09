import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/jobs', label: 'Jobs', roles: ['ADMIN', 'EMPLOYER', 'APPLICANT', null] },
  { to: '/dashboard/admin', label: 'Admin Dashboard', roles: ['ADMIN'] },
  { to: '/dashboard/recruiter', label: 'Employer Dashboard', roles: ['EMPLOYER'] },
  { to: '/jobs/post', label: 'Post Job', roles: ['EMPLOYER'] },
  { to: '/dashboard/jobseeker', label: 'Job Seeker Dashboard', roles: ['APPLICANT'] },
  { to: '/applications', label: 'Applications', roles: ['APPLICANT'] },
  { to: '/saved-jobs', label: 'Saved Jobs', roles: ['ADMIN', 'EMPLOYER', 'APPLICANT'] },
  { to: '/companies/1/reviews', label: 'Company Reviews', roles: ['ADMIN', 'EMPLOYER', 'APPLICANT'] },
  { to: '/notifications', label: 'Notifications', roles: ['ADMIN', 'EMPLOYER', 'APPLICANT'] },
  { to: '/profile', label: 'Profile', roles: ['ADMIN', 'EMPLOYER', 'APPLICANT'] },
];

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-30" role="banner">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Job Portal Home"
        >
          JobPortal
        </Link>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2 lg:gap-6">
          {navLinks.map(
            ({ to, label, roles }) =>
              isAuthenticated && roles.includes(user?.accountType)
                ? (
                    <Link
                      key={to}
                      to={to}
                      className="px-2 py-1 rounded text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                    >
                      {label}
                    </Link>
                  )
                : null
          )}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="px-2 py-1 rounded text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-2 px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              >
                Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </nav>
        {/* Mobile menu button (future: add mobile nav) */}
        <div className="md:hidden">
          {/* TODO: Add mobile menu button and drawer */}
        </div>
      </div>
    </header>
  );
};

export default Header;

