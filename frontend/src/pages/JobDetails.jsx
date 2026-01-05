
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    resumeUrl: '',
    coverLetter: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const jobData = await jobService.getJobById(id);
      setJob(jobData);
    } catch (error) {
      setErrorMsg('Error fetching job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await applicationService.applyToJob(id, applicationData);
      setSuccessMsg('Application submitted successfully!');
      setTimeout(() => navigate('/applications'), 1200);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || error.message 
        || 'Failed to submit application';
      setErrorMsg(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <span className="text-lg text-gray-600 dark:text-gray-300">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 px-4 py-2 rounded shadow">
          Job not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 md:p-12 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 shadow-lg border-4 border-white dark:border-zinc-900">
          <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0a4 4 0 01-8 0m8 0v2a4 4 0 01-8 0V7m8 0a4 4 0 00-8 0" /></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 mt-10 text-zinc-900 dark:text-white">{job.title}</h1>
        <p className="text-lg text-center text-primary-600 dark:text-primary-400 font-semibold mb-1">{job.company}</p>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">{job.location} • {job.jobType}</p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {isAuthenticated && user?.accountType === 'APPLICANT' && (
          <div className="mt-10 border-t border-gray-200 dark:border-zinc-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Apply for this Job</h2>
            {successMsg && (
              <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 shadow">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 px-4 py-2 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 shadow">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleApply} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2" htmlFor="resumeUrl">
                  Resume URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="resumeUrl"
                  type="url"
                  required
                  value={applicationData.resumeUrl}
                  onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary-400"
                  placeholder="https://your-resume-link.com"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2" htmlFor="coverLetter">
                  Cover Letter <span className="text-xs text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary-400"
                  rows="4"
                  placeholder="Write your cover letter..."
                />
              </div>
              <button
                type="submit"
                disabled={applying}
                className="w-full bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={applying}
              >
                {applying ? (
                  <span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</span>
                ) : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;

