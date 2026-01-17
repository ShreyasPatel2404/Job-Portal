import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Briefcase, ArrowUpRight, CalendarClock, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'framer-motion';

const EmployerDashboard = () => {
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

  // In a real app these would come from analytics APIs
  const metrics = [
    { label: 'Active jobs', value: 8, delta: '+2 this week', icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: 'New applicants', value: 43, delta: '+18 vs last week', icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: 'Avg. match score', value: '82%', delta: 'High quality pipeline', icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: 'Interviews scheduled', value: 12, delta: 'Next 7 days', icon: CalendarClock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const pipelines = [
    { stage: 'New', count: 26, color: "bg-blue-500" },
    { stage: 'Screening', count: 14, color: "bg-violet-500" },
    { stage: 'Interviewing', count: 9, color: "bg-amber-500" },
    { stage: 'Offer', count: 3, color: "bg-emerald-500" },
  ];

  return (
    <DashboardLayout
      role="EMPLOYER"
      title="Recruiter Workspace"
      description="Monitor your pipeline, manage active roles, and move the best candidates forward."
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Top metrics */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div variants={item} key={metric.label}>
                <div className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <div className={`p-2 rounded-lg ${metric.bg} transition-colors group-hover:bg-opacity-20`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">{metric.delta}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </section>

        {/* Pipeline & quick actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="glass-card h-full border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pipeline Health</CardTitle>
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
                    className="group flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 text-sm dark:bg-zinc-900/40 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {stage.stage}
                      </span>
                      <span className="text-xs text-muted-foreground bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-zinc-700">
                        {stage.count} candidates
                      </span>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      View
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass-card h-full border-none shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Link
                  to="/jobs/post"
                  className="group flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-primary hover:bg-primary/10 transition-colors"
                >
                  <span className="font-medium">Post a new role</span>
                  <div className="bg-primary/20 p-1 rounded-full group-hover:bg-primary/30 transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </Link>
                <Link
                  to="/dashboard/recruiter/applications"
                  className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-gray-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-900 transition-colors"
                >
                  <span>Review new applicants</span>
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  to="/dashboard/recruiter/interviews"
                  className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-gray-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-900 transition-colors"
                >
                  <span>Schedule interviews</span>
                  <CalendarClock className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
