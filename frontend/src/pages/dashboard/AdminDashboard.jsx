import React from 'react';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart3, Users, Briefcase, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const tiles = [
    { label: 'Total users', value: '12,430', icon: Users },
    { label: 'Active jobs', value: '842', icon: Briefcase },
    { label: 'Daily applications', value: '3,219', icon: BarChart3 },
    { label: 'Flags / reviews', value: '17 open', icon: ShieldAlert },
  ];

  return (
    <DashboardShell
      role="ADMIN"
      title="Platform control center"
      description="Monitor marketplace health, moderate content, and keep the experience safe for everyone."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card key={tile.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {tile.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {tile.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Job moderation queue</CardTitle>
              <Badge variant="warning">17 pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Review jobs that were automatically flagged by our quality and safety systems.
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-xs text-gray-600 dark:border-zinc-700 dark:text-gray-300">
              No jobs loaded yet. Connect this panel to the moderation API to show flagged
              postings with reasons (e.g. salary anomalies, missing details, potential spam).
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>User & company health</CardTitle>
              <Badge variant="outline">Overview</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <p>
              • Monitor sign-up funnels, email verification rates, and account risk signals.
            </p>
            <p>
              • Track report volume across companies, jobs, and candidates to spot abuse early.
            </p>
            <p>
              • Integrate with your observability stack (Prometheus, Grafana, etc.) for detailed
              platform health dashboards.
            </p>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
};

export default AdminDashboard;
