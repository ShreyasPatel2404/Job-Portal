import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

const EmployerApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState('');

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
      fetchApplications(selectedJobId, page);
    } finally {
      setStatusUpdating('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Applications for My Jobs</h1>
      {loadingJobs ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No jobs posted yet.</div>
      ) : (
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Job:</label>
          <select value={selectedJobId} onChange={e => { setSelectedJobId(e.target.value); setPage(0); }} className="px-3 py-2 border rounded">
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} @ {job.company}</option>
            ))}
          </select>
        </div>
      )}
      {selectedJobId && (
        <div>
          {loadingApps ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No applications for this job.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-zinc-800 rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Applicant</th>
                    <th className="px-4 py-2 text-left">Resume</th>
                    <th className="px-4 py-2 text-left">Cover Letter</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Applied On</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} className="border-t dark:border-zinc-700">
                      <td className="px-4 py-2">{app.applicantName || app.applicantEmail}</td>
                      <td className="px-4 py-2"><a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Resume</a></td>
                      <td className="px-4 py-2 max-w-xs truncate">{app.coverLetter}</td>
                      <td className="px-4 py-2">{app.status}</td>
                      <td className="px-4 py-2">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 space-x-2">
                        {app.status === 'PENDING' && (
                          <>
                            <button disabled={statusUpdating === app.id+'ACCEPTED'} onClick={() => handleStatusChange(app.id, 'ACCEPTED')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50">Accept</button>
                            <button disabled={statusUpdating === app.id+'REJECTED'} onClick={() => handleStatusChange(app.id, 'REJECTED')} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                  <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition disabled:opacity-50">Previous</button>
                  <span className="px-4 py-2 text-gray-700 dark:text-gray-200">Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition disabled:opacity-50">Next</button>
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
