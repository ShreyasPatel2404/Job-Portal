import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/common/ToastContainer.jsx';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Applications for my jobs
      </h1>
      {loadingJobs ? (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300 animate-pulse">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No jobs posted yet. Post a role from your recruiter dashboard to start receiving
          candidates.
        </div>
      ) : (
        <div className="mb-6 text-xs">
          <label className="mb-1 block font-medium text-gray-800 dark:text-gray-100">
            Select job
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setPage(0);
            }}
            className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} @ {job.company}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedJobId && (
        <div>
          {loadingApps ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300 animate-pulse">
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No applications for this job.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-[11px] text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Applicant</th>
                    <th className="px-4 py-2 text-left font-medium">Resume</th>
                    <th className="px-4 py-2 text-left font-medium">Cover letter</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Applied</th>
                    <th className="px-4 py-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t text-xs text-gray-800 dark:border-zinc-800 dark:text-gray-100"
                    >
                      <td className="px-4 py-2">{app.applicantName || app.applicantEmail}</td>
                      <td className="px-4 py-2">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-primary-600 hover:underline dark:text-primary-300"
                        >
                          Resume
                        </a>
                      </td>
                      <td className="max-w-xs px-4 py-2 truncate">{app.coverLetter}</td>
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
                      <td className="px-4 py-2 space-x-2">
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              disabled={statusUpdating === app.id + 'ACCEPTED'}
                              onClick={() => handleStatusChange(app.id, 'ACCEPTED')}
                              className="rounded bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              disabled={statusUpdating === app.id + 'REJECTED'}
                              onClick={() => handleStatusChange(app.id, 'REJECTED')}
                              className="rounded bg-red-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
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
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
