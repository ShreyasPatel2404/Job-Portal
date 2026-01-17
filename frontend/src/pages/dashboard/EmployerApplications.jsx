import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/common/ToastContainer.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Filter, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

const EmployerApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState('');
  const { show } = useToast();

  useEffect(() => {
    fetchMyJobs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedJobId) fetchApplications(selectedJobId, page);
    // eslint-disable-next-line
  }, [selectedJobId, page]);

  const fetchMyJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await jobService.getMyJobs(0, 100);
      setJobs(response.content || []);
      if (response.content && response.content.length > 0) {
        setSelectedJobId(response.content[0].id);
      }
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async (jobId, pageNum = 0) => {
    setLoadingApps(true);
    try {
      const response = await applicationService.getJobApplications(jobId, pageNum, 10);
      setApplications(response.content || []);
      setTotalPages(response.totalPages || 0);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating(appId + newStatus);
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      show({
        variant: 'success',
        title: 'Status updated',
        description:
          newStatus === 'ACCEPTED'
            ? 'Candidate moved forward in your pipeline.'
            : 'Candidate has been rejected for this role.',
      });
      fetchApplications(selectedJobId, page);
    } catch {
      show({
        variant: 'error',
        title: 'Update failed',
        description: 'We could not update this application. Try again in a moment.',
      });
    } finally {
      setStatusUpdating('');
    }
  };

  return (
    <DashboardLayout
      role="EMPLOYER"
      title="Candidate Applications"
      description="Manage and review applicants for your open roles."
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Candidate Applications
            </h1>
            <p className="text-muted-foreground mt-1">Manage and review applicants for your open roles.</p>
          </div>
        </div>

        {loadingJobs ? (
          <div className="h-12 w-64 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No jobs posted yet. Create a job to start receiving applications.</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Filter className="w-5 h-5" />
              </div>
              <div className="flex-1 max-w-xl">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">
                  Select Job Role
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setPage(0);
                  }}
                  className="w-full rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedJobId && (
              <div className="relative min-h-[400px]">
                {loadingApps ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10 rounded-xl">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No applicants yet</h3>
                    <p className="text-muted-foreground">This job hasn't received any applications.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-700">
                      <thead className="bg-slate-50 dark:bg-zinc-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assets</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cover Letter</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-zinc-900 divide-y divide-slate-200 dark:divide-zinc-800">
                        {applications.map((app) => (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={app.id}
                            className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                                  {(app.applicantName || app.applicantEmail || '?')[0].toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{app.applicantName || 'Unknown'}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{app.applicantEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View Resume
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-300" title={app.coverLetter}>
                                {app.coverLetter || <span className="text-gray-400 italic">No cover letter</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant={
                                  app.status === 'ACCEPTED'
                                    ? 'success'
                                    : app.status === 'REJECTED'
                                      ? 'destructive'
                                      : 'secondary'
                                }
                                className="capitalize"
                              >
                                {app.status.toLowerCase()}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {app.status === 'PENDING' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    disabled={statusUpdating === app.id + 'ACCEPTED'}
                                    onClick={() => handleStatusChange(app.id, 'ACCEPTED')}
                                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
                                    title="Accept"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button
                                    disabled={statusUpdating === app.id + 'REJECTED'}
                                    onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                    title="Reject"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Processed</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 0}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages - 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployerApplications;
