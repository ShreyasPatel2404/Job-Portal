import React, { useEffect, useState } from 'react';
import { applicationService } from '../services/applicationService';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../components/common/ToastContainer.jsx';

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
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">My Applications</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Track and manage your job applications
        </p>
      </div>
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading applications...</p>
        </div>
      ) : applications.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800" role="table">
              <thead className="bg-slate-50 dark:bg-zinc-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Job
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Applied
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-zinc-900 dark:divide-zinc-800">
                {applications.map((app) => (
                  <tr 
                    key={app.id} 
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {app.jobTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {app.company}
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
                        className="text-xs"
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            aria-label={`View resume for ${app.jobTitle}`}
                          >
                            View Resume
                          </a>
                        )}
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleWithdrawClick(app.id, app.jobTitle)}
                            className="font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            aria-label={`Withdraw application for ${app.jobTitle}`}
                          >
                            Withdraw
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
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page <span className="font-semibold">{page + 1}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-md px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
              No applications yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmWithdraw}
            className="rounded-md bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-700"
          >
            Withdraw
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default Applications;
