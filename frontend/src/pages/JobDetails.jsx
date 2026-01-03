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

  useEffect(() => {
    fetchJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const jobData = await jobService.getJobById(id);
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await applicationService.applyToJob(id, applicationData);
      alert('Application submitted successfully!');
      navigate('/applications');
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || error.message 
        || 'Failed to submit application';
      alert(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto px-4 py-8 text-center">Job not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{job.company}</p>
        <p className="text-gray-500 mb-6">{job.location} • {job.jobType}</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {isAuthenticated && user?.accountType === 'APPLICANT' && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Apply for this Job</h2>
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  required
                  value={applicationData.resumeUrl}
                  onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Write your cover letter..."
                />
              </div>
              <button
                type="submit"
                disabled={applying}
                className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;

