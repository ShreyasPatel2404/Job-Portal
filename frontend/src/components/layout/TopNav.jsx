import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Sparkles, Bell, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

// Top navigation used for marketing + seeker experience
export const TopNav = ({ onOpenMobileNav }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isRecruiter = user?.accountType === 'EMPLOYER';
  const isAdmin = user?.accountType === 'ADMIN';
  const isSeeker = user?.accountType === 'APPLICANT';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (onOpenMobileNav) {
      onOpenMobileNav();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:bg-zinc-950/95 dark:border-zinc-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline-flex">
            JobPortal
          </span>
        </Link>

        {/* Primary nav - desktop */}
        <nav className="hidden items-center gap-8 text-base font-medium text-gray-700 dark:text-gray-300 md:flex">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              cn(
                'transition-colors hover:text-gray-900 dark:hover:text-white',
                isActive && 'text-gray-900 dark:text-white'
              )
            }
          >
            Jobs
          </NavLink>

          {isSeeker && (
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-gray-900 dark:hover:text-white',
                  isActive && 'text-gray-900 dark:text-white'
                )
              }
            >
              Applications
            </NavLink>
          )}

          {isRecruiter && (
            <NavLink
              to="/dashboard/recruiter"
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-gray-900 dark:hover:text-white',
                  isActive && 'text-gray-900 dark:text-white'
                )
              }
            >
              Recruiter
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-gray-900 dark:hover:text-white',
                  isActive && 'text-gray-900 dark:text-white'
                )
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <NavLink
                to="/notifications"
                className="hidden rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800 md:inline-flex"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </NavLink>

              <NavLink
                to={isSeeker ? '/dashboard/jobseeker' : isRecruiter ? '/dashboard/recruiter' : isAdmin ? '/dashboard/admin' : '/profile'}
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800 md:inline-flex"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="max-w-[120px] truncate">
                  {user?.fullName || user?.email || 'Account'}
                </span>
              </NavLink>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:inline-flex"
              >
                Sign out
              </Button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
                className="hidden sm:inline-flex"
              >
                <Sparkles className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Sign up
              </Button>
            </>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800 md:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4 space-y-2" aria-label="Mobile navigation">
            <NavLink
              to="/jobs"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
                )
              }
            >
              Jobs
            </NavLink>

            {isSeeker && (
              <NavLink
                to="/applications"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
                  )
                }
              >
                Applications
              </NavLink>
            )}

            {isRecruiter && (
              <NavLink
                to="/dashboard/recruiter"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
                  )
                }
              >
                Recruiter
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/dashboard/admin"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
                  )
                }
              >
                Admin
              </NavLink>
            )}

            {isAuthenticated && (
              <>
                <NavLink
                  to="/notifications"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
                    )
                  }
                >
                  Notifications
                </NavLink>

                <NavLink
                  to={isSeeker ? '/dashboard/jobseeker' : isRecruiter ? '/dashboard/recruiter' : isAdmin ? '/dashboard/admin' : '/profile'}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900'
                    )
                  }
                >
                  Profile
                </NavLink>

                <div className="border-t border-gray-200 pt-2 mt-2 dark:border-zinc-800">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-4 py-2.5 text-left text-base font-medium text-gray-700 hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-2 dark:border-zinc-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/login');
                  }}
                  className="w-full justify-start"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    closeMobileMenu();
                    navigate('/register');
                  }}
                  className="w-full justify-start"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Sign up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};


