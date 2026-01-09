import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  CalendarClock,
} from 'lucide-react';

// Reusable dashboard layout with responsive sidebar for Recruiter & Admin
export const DashboardShell = ({ role, title, description, children }) => {
  const navItems =
    role === 'EMPLOYER'
      ? [
          { to: '/dashboard/recruiter', label: 'Overview', icon: LayoutDashboard },
          { to: '/jobs/post', label: 'Post a Job', icon: Briefcase },
          { to: '/dashboard/recruiter/applications', label: 'Applications', icon: Users },
          { to: '/dashboard/resumes', label: 'Resumes', icon: FileText },
          { to: '/dashboard/recruiter/interviews', label: 'Interviews', icon: CalendarClock },
          { to: '/settings', label: 'Settings', icon: Settings },
        ]
      : role === 'ADMIN'
      ? [
          { to: '/dashboard/admin', label: 'Platform Overview', icon: LayoutDashboard },
          { to: '/dashboard/admin/users', label: 'Users', icon: Users },
          { to: '/dashboard/admin/jobs', label: 'Jobs & Moderation', icon: Briefcase },
          { to: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/settings', label: 'Settings', icon: Settings },
        ]
      : [
          { to: '/dashboard/jobseeker', label: 'Overview', icon: LayoutDashboard },
          { to: '/applications', label: 'Applications', icon: Briefcase },
          { to: '/saved-jobs', label: 'Saved jobs', icon: FileText },
          { to: '/dashboard/jobseeker/resumes', label: 'Resumes', icon: FileText },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:block">
          <div className="mb-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {role === 'EMPLOYER'
                ? 'Recruiter'
                : role === 'ADMIN'
                ? 'Admin'
                : 'Job seeker'}
            </p>
            <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-50">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <nav className="space-y-1" aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-slate-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800',
                      isActive &&
                        'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-6">
          <div className="mb-4 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};


