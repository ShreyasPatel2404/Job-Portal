import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart3, Users, Briefcase, ShieldAlert, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const tiles = [
    { label: 'Total users', value: '12,430', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active jobs', value: '842', change: '+5%', icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Daily applications', value: '3,219', change: '+18%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Flags / reviews', value: '17 open', change: '-2%', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <DashboardLayout
      role="ADMIN"
      title="Platform Control Center"
      description="Monitor marketplace health, moderate content, and keep the experience safe for everyone."
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <motion.div variants={item} key={tile.label}>
                <div className="glass-card rounded-xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {tile.label}
                    </p>
                    <div className={`p-2 rounded-lg ${tile.bg} transition-colors group-hover:bg-opacity-20`}>
                      <Icon className={`h-4 w-4 ${tile.color}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="text-2xl font-bold text-foreground">
                      {tile.value}
                    </div>
                    <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {tile.change}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item}>
            <Card className="glass-card h-full border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    <CardTitle>Job Moderation Queue</CardTitle>
                  </div>
                  <Badge variant="warning" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    17 pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  Review jobs that were automatically flagged by our quality and safety systems.
                </p>
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 px-6 py-8 text-center text-sm text-muted-foreground">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <Briefcase className="h-6 w-6 text-slate-400" />
                  </div>
                  No high-priority flags right now. <br /> Check back later or adjust sensitivity settings.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass-card h-full border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <CardTitle>System Health</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    All Systems Operational
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { label: 'API Latency', value: '45ms', status: 'optimal' },
                    { label: 'Database Load', value: '12%', status: 'optimal' },
                    { label: 'Email Delivery', value: '99.9%', status: 'optimal' }
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                      <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">{metric.value}</span>
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
