import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Bookmark, Briefcase, TrendingUp } from 'lucide-react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

const JobSeekerDashboard = () => {
  // In production, these would be derived from real application + profile data.
  const resumeStrength = 76;

  const recommendations = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      company: 'Northwind Labs',
      match: 92,
      tags: ['React', 'TypeScript', 'Design Systems'],
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Contoso AI',
      match: 87,
      tags: ['Spring Boot', 'React', 'Microservices'],
    },
    {
      id: 3,
      title: 'Product Engineer',
      company: 'Fabrikam Cloud',
      match: 81,
      tags: ['APIs', 'UI/UX', 'SaaS'],
    },
  ];

  const applicationStats = [
    { label: 'Applied', value: 14 },
    { label: 'In review', value: 6 },
    { label: 'Interviews', value: 3 },
    { label: 'Offers', value: 1 },
  ];

  return (
    <DashboardShell
      role="APPLICANT"
      title="Your job search hub"
      description="Track your applications, strengthen your profile and act on tailored AI suggestions."
    >
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Resume strength */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-500" aria-hidden="true" />
              Resume strength
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {resumeStrength}%
              </span>
              <Badge variant={resumeStrength > 80 ? 'success' : 'warning'}>
                {resumeStrength > 80 ? 'Ready to apply' : 'Good, can improve'}
              </Badge>
            </div>
            <Progress value={resumeStrength} />
            <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <li>• Add 1–2 more measurable achievements</li>
              <li>• Include 3–5 skills that match current market demand</li>
              <li>• Tailor your summary to your target roles</li>
            </ul>
            <Link
              to="/dashboard/jobseeker/resumes"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
            >
              Open resume manager
            </Link>
          </CardContent>
        </Card>

        {/* Application status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary-500" aria-hidden="true" />
              Application status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              {applicationStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-gray-50 px-3 py-2 text-center text-xs dark:bg-zinc-900/60"
                >
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    {item.value}
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/applications"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
            >
              View all applications
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Recommendations */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-500" aria-hidden="true" />
                AI-powered recommendations
              </CardTitle>
              <Badge variant="outline" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Personalized for you
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recommendations.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 hover:border-primary-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {job.company}
                    </p>
                  </div>
                  <Badge
                    variant={job.match >= 90 ? 'success' : 'secondary'}
                    className="text-xs"
                  >
                    Match score: {job.match}%
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1 text-xs">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-[11px] text-gray-600 hover:border-primary-400 hover:text-primary-700 dark:border-zinc-700 dark:text-gray-200 dark:hover:border-primary-600 dark:hover:text-primary-300"
                  >
                    <Bookmark className="h-3 w-3" aria-hidden="true" />
                    Save
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
};

export default JobSeekerDashboard;
