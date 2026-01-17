import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Bookmark, Briefcase, TrendingUp, CheckCircle, Clock, FileText } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { motion } from 'framer-motion';

const JobSeekerDashboard = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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
    { label: 'Applied', value: 14, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: 'In review', value: 6, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: 'Interviews', value: 3, icon: Briefcase, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: 'Offers', value: 1, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <DashboardLayout
      role="APPLICANT"
      title="Your Job Search Hub"
      description="Track your applications, strengthen your profile and act on tailored AI suggestions."
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Resume strength */}
          <motion.div variants={item} className="lg:col-span-1">
            <Card className="glass-card h-full border-none shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                  Resume Strength
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-foreground">
                    {resumeStrength}%
                  </span>
                  <Badge variant={resumeStrength > 80 ? 'success' : 'warning'} className="text-sm py-1">
                    {resumeStrength > 80 ? 'Ready to apply' : 'Good, can improve'}
                  </Badge>
                </div>
                <Progress value={resumeStrength} className="h-2" />
                <ul className="space-y-3">
                  {[
                    'Add 1–2 more measurable achievements',
                    'Include 3–5 skills that match current market demand',
                    'Tailor your summary to your target roles'
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-lg">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dashboard/jobseeker/resumes"
                  className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  Open Resume Manager
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application status */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="glass-card h-full border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-4">
                  {applicationStats.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="group relative flex flex-col items-center justify-center rounded-2xl bg-slate-50/50 p-4 text-center dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 hover:border-primary/20 transition-all hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-md"
                      >
                        <div className={`p-3 rounded-full ${item.bg} mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-foreground mb-1">
                          {item.value}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-xl p-4 flex items-center justify-between border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Keep passing momentum!</p>
                      <p className="text-xs text-muted-foreground">You applied to 3 jobs this week.</p>
                    </div>
                  </div>
                  <Link
                    to="/applications"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View All
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div variants={item}>
          <Card className="glass-card border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  AI-Powered Recommendations
                </CardTitle>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-violet-500 text-white text-xs font-medium shadow-md shadow-primary/20">
                  <Sparkles className="h-3 w-3" />
                  <span>Personalized for you</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {recommendations.map((job) => (
                  <div
                    key={job.id}
                    className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white/50 p-5 hover:border-primary/50 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant={job.match >= 90 ? 'success' : 'secondary'}
                          className="text-[10px] px-2 py-0.5 h-auto"
                        >
                          {job.match}% Match
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-[10px] font-medium text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="mt-2 w-full flex items-center justify-center py-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-medium text-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm"
                    >
                      View Role
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;
