import React, { useEffect, useState } from 'react';
import { applicationService } from '../services/applicationService';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Applications</h1>
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading applications...</div>
      ) : applications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-zinc-800 rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Job Title</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Applied On</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-t dark:border-zinc-700">
                  <td className="px-4 py-2">{app.jobTitle}</td>
                  <td className="px-4 py-2">{app.company}</td>
                  <td className="px-4 py-2">{app.status}</td>
                  <td className="px-4 py-2">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline mr-2">Resume</a>
                    {app.status === 'PENDING' && (
                      <button onClick={() => handleWithdraw(app.id)} className="text-red-600 hover:underline">Withdraw</button>
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
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No applications found</div>
      )}
    </div>
  );

  function handleWithdraw(id) {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      applicationService.withdrawApplication(id).then(fetchApplications);
    }
  }
};

export default Applications;
