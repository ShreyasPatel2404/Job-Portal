
import React, { useState } from 'react';
import { applicationService } from '../services/applicationService';
import { useNavigate } from 'react-router-dom';

const ApplyJobModal = ({ job, onClose }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setResumeFile(null);
    } else {
      setError('');
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!resumeFile) {
      setError('Please upload your resume (PDF).');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      await applicationService.applyToJobWithFile(job.id, formData);
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewApplications = () => {
    onClose();
    navigate('/applications');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-primary/20">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-primary">Apply for {job.title}</h2>
        {success ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="text-green-600 text-lg font-semibold">{success}</div>
            <button
              className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition text-base shadow-md"
              onClick={handleViewApplications}
            >
              View My Applications
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Resume (PDF) <span className="text-red-500">*</span></label>
              <input type="file" accept="application/pdf" onChange={handleResumeChange} className="block w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover Letter <span className="text-gray-400 text-xs">(optional)</span></label>
              <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" rows="4" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Write your cover letter..." />
            </div>
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 border border-blue-900 text-white py-3 font-bold text-lg hover:bg-blue-800 focus:bg-blue-900 focus:text-white transition shadow-md"
              style={{ background: '#2563eb', color: '#fff', border: '2px solid #1e40af', letterSpacing: '0.5px' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Resume & Apply'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyJobModal;
