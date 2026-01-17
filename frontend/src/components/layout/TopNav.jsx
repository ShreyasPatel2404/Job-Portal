import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Sparkles, User, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

// Top navigation used for marketing + seeker experience
export const TopNav = ({ onOpenMobileNav }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isRecruiter = user?.accountType === 'EMPLOYER';
  const isAdmin = user?.accountType === 'ADMIN';
  const isSeeker = user?.accountType === 'APPLICANT';

  const dashboardLink = isSeeker ? '/dashboard/jobseeker' : isRecruiter ? '/dashboard/recruiter' : isAdmin ? '/dashboard/admin' : '/dashboard';

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
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/20">
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="hidden sm:inline-flex bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
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
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {(user?.fullName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user?.fullName || 'Account'}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", profileOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl outline-none z-50 overflow-hidden bg-white dark:bg-zinc-950"
                    >
                      <div className="flex flex-col p-1">
                        <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border/50 mb-1">
                          <p className="font-medium text-foreground truncate">{user?.fullName}</p>
                          <p className="text-xs truncate opacity-70">{user?.email}</p>
                        </div>

                        <Link
                          to={dashboardLink}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-200"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-200"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>

                        <div className="h-px bg-border/50 my-1" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
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
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden overflow-hidden"
          >
            <nav className="mx-auto max-w-6xl px-4 py-4 space-y-1" aria-label="Mobile navigation">
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

              {isAuthenticated ? (
                <>
                  <NavLink
                    to={dashboardLink}
                    onClick={closeMobileMenu}
                    className="block rounded-md px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block rounded-md px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Profile
                  </NavLink>
                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-2 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-md px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 mt-2 grid gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      closeMobileMenu();
                      navigate('/login');
                    }}
                    className="w-full justify-start text-base h-11"
                  >
                    Log in
                  </Button>
                  <Button

                    onClick={() => {
                      closeMobileMenu();
                      navigate('/register');
                    }}
                    className="w-full justify-start text-base h-11"
                  >
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                    Sign up
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


