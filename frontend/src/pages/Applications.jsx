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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">My applications</h1>
      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300 animate-pulse">
          Loading applications...
        </div>
      ) : applications.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-[11px] text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Job</th>
                <th className="px-4 py-2 text-left font-medium">Company</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Applied</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t text-xs text-gray-800 dark:border-zinc-800 dark:text-gray-100">
                  <td className="px-4 py-2">{app.jobTitle}</td>
                  <td className="px-4 py-2">{app.company}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        app.status === 'ACCEPTED'
                          ? 'success'
                          : app.status === 'REJECTED'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-3 text-[11px] font-medium text-primary-600 hover:underline dark:text-primary-300"
                    >
                      Resume
                    </a>
                    {app.status === 'PENDING' && (
                      <button
                        onClick={() => handleWithdrawClick(app.id, app.jobTitle)}
                        className="text-[11px] font-medium text-red-600 hover:underline"
                      >
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 border-t border-gray-200 bg-gray-50 py-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-primary-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
              >
                Previous
              </button>
              <span className="px-2 py-1 text-gray-700 dark:text-gray-200">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-primary-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No applications found yet. When you apply to roles, they’ll appear here with live status
          updates.
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
