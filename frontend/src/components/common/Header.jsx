import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            JobPortal
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-700 hover:text-primary-600">
              Jobs
            </Link>

            {isAuthenticated ? (
              <>
                {user?.accountType === 'EMPLOYER' && (
                  <>
                    <Link to="/dashboard/recruiter" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/jobs/post" className="text-gray-700 hover:text-primary-600">
                      Post Job
                    </Link>
                  </>
                )}
                {user?.accountType === 'APPLICANT' && (
                  <>
                    <Link to="/dashboard/jobseeker" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/applications" className="text-gray-700 hover:text-primary-600">
                      Applications
                    </Link>
                  </>
                )}
                {user?.accountType === 'ADMIN' && (
                  <Link to="/dashboard/admin" className="text-gray-700 hover:text-primary-600">
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

