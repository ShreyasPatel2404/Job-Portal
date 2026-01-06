import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Briefcase, ArrowUpRight, CalendarClock } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const EmployerDashboard = () => {
  // In a real app these would come from analytics APIs
  const metrics = [
    { label: 'Active jobs', value: 8, delta: '+2 this week' },
    { label: 'New applicants', value: 43, delta: '+18 vs last week' },
    { label: 'Avg. match score', value: '82%', delta: 'High quality pipeline' },
    { label: 'Interviews scheduled', value: 12, delta: 'Next 7 days' },
  ];

  const pipelines = [
    { stage: 'New', count: 26 },
    { stage: 'Screening', count: 14 },
    { stage: 'Interviewing', count: 9 },
    { stage: 'Offer', count: 3 },
  ];

  return (
    <DashboardShell
      role="EMPLOYER"
      title="Recruiter workspace"
      description="Monitor your pipeline, manage active roles, and move the best candidates forward."
    >
      {/* Top metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {metric.label}
              </CardTitle>
              {metric.label === 'New applicants' && (
                <Users className="h-4 w-4 text-primary-500" aria-hidden="true" />
              )}
              {metric.label === 'Active jobs' && (
                <Briefcase className="h-4 w-4 text-primary-500" aria-hidden="true" />
              )}
              {metric.label === 'Avg. match score' && (
                <BarChart3 className="h-4 w-4 text-primary-500" aria-hidden="true" />
              )}
              {metric.label === 'Interviews scheduled' && (
                <CalendarClock className="h-4 w-4 text-primary-500" aria-hidden="true" />
              )}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                {metric.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Pipeline & quick actions */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pipeline health</CardTitle>
              <Badge variant="outline" className="gap-1 text-xs">
                <BarChart3 className="h-3 w-3" aria-hidden="true" />
                Auto-prioritized by AI
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelines.map((stage) => (
              <div
                key={stage.stage}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-zinc-900/60"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {stage.stage}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stage.count} candidates
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
                >
                  View candidates
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Link
              to="/jobs/post"
              className="flex items-center justify-between rounded-md border border-dashed border-gray-300 px-3 py-2 text-primary-700 hover:border-primary-400 hover:bg-primary-50/40 dark:border-zinc-700 dark:text-primary-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/10"
            >
              <span>Post a new role</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/dashboard/recruiter/applications"
              className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-900"
            >
              <span>Review new applicants</span>
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/dashboard/recruiter/interviews"
              className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-900"
            >
              <span>Schedule interviews</span>
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
};

export default EmployerDashboard;
