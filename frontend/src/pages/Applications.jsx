import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { applicationService } from '../services/applicationService';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../components/common/ToastContainer.jsx';
import { motion } from 'framer-motion';
import { FileText, Building2, Calendar, Ban } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [withdrawId, setWithdrawId] = useState(null);
  const [pendingJobTitle, setPendingJobTitle] = useState('');
  const { show } = useToast();

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyApplications(page, 10);
      setApplications(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      setApplications([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawClick = (id, jobTitle) => {
    setWithdrawId(id);
    setPendingJobTitle(jobTitle || '');
  };

  const confirmWithdraw = async () => {
    if (!withdrawId) return;
    try {
      await applicationService.withdrawApplication(withdrawId);
      show({
        variant: 'success',
        title: 'Application withdrawn',
        description: 'We’ve updated your application status for this role.',
      });
      fetchApplications();
    } catch {
      show({
        variant: 'error',
        title: 'Failed to withdraw',
        description: 'Please try again or refresh the page.',
      });
    } finally {
      setWithdrawId(null);
      setPendingJobTitle('');
    }
  };

  return (
    <DashboardLayout
      role="APPLICANT"
      title="My Applications"
      description="Track and manage your job applications."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Track Applications
          </h2>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : applications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-white/20 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backend-blur-xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border" role="table">
                <thead className="bg-slate-50/50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Job
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Applied
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {app.jobTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {app.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            app.status === 'ACCEPTED' || app.status === 'hired'
                              ? 'success'
                              : app.status === 'REJECTED' || app.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className="text-xs capitalize"
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-4">
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:text-primary/80 transition-colors text-xs border border-primary/20 px-3 py-1.5 rounded-md bg-primary/5 hover:bg-primary/10"
                              aria-label={`View resume for ${app.jobTitle}`}
                            >
                              Resume
                            </a>
                          )}
                          {(app.status === 'PENDING' || app.status === 'pending') && (
                            <button
                              onClick={() => handleWithdrawClick(app.id, app.jobTitle)}
                              className="flex items-center gap-1 font-medium text-destructive hover:text-destructive/80 transition-colors text-xs"
                              aria-label={`Withdraw application for ${app.jobTitle}`}
                            >
                              <Ban className="w-3.5 h-3.5" /> Withdraw
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border bg-slate-50/50 dark:bg-zinc-900/50 px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Page <span className="font-semibold text-foreground">{page + 1}</span> of{' '}
                  <span className="font-semibold text-foreground">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-lg border border-border bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 rounded-lg border border-border bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="glass-card rounded-2xl border-dashed border-2 border-slate-200 dark:border-zinc-800 py-20 text-center">
            <div className="mx-auto max-w-md px-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No applications yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When you apply to roles, they'll appear here with live status updates.
              </p>
            </div>
          </div>
        )}

        <Dialog open={Boolean(withdrawId)} onClose={() => setWithdrawId(null)}>
          <DialogHeader>
            <DialogTitle>Withdraw application?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {pendingJobTitle
              ? `You’re about to withdraw from “${pendingJobTitle}”. This can’t be undone, and the employer will no longer see you in their pipeline.`
              : 'You’re about to withdraw this application. This cannot be undone.'}
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setWithdrawId(null)}
              className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmWithdraw}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-medium"
            >
              Withdraw
            </button>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Applications;
