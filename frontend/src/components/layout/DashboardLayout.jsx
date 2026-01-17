import React from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  CalendarClock,
  Bookmark
} from 'lucide-react';

// Reusable dashboard layout with responsive sidebar for Recruiter & Admin
export const DashboardLayout = ({ role, title, description, children }) => {
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
          { to: '/saved-jobs', label: 'Saved jobs', icon: Bookmark },
          { to: '/dashboard/jobseeker/resumes', label: 'Resumes', icon: FileText },
          { to: '/settings', label: 'Settings', icon: Settings },
        ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background relative">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 relative z-10">
        {/* Background Gradients */}
        <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[80px]" />
        </div>

        {/* Sidebar */}
        <Sidebar role={role} title={title} description={description} navItems={navItems} />

        {/* Main content */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0"
        >
          <div className="mb-6 lg:hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              {role === 'EMPLOYER' ? 'Recruiter' : role === 'ADMIN' ? 'Admin' : 'Job seeker'}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-sm min-h-[500px]">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};


