import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';

const initialJob = {
  title: '',
  company: '',
  companyLogo: '',
  description: '',
  requirements: '',
  responsibilities: '',
  location: '',
  jobType: '',
  experienceLevel: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: '',
  category: '',
  industry: '',
  skills: '',
  applicationDeadline: '',
  isFeatured: false,
};

const JobPost = () => {
  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await jobService.createJob(job);
      navigate('/dashboard/recruiter');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
            <input id="title" name="title" value={job.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="company">Company</label>
            <input id="company" name="company" value={job.company} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="companyLogo">Company Logo URL</label>
            <input id="companyLogo" name="companyLogo" value={job.companyLogo} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="location">Location</label>
            <input id="location" name="location" value={job.location} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="jobType">Job Type</label>
            <select id="jobType" name="jobType" value={job.jobType} onChange={handleChange} required className="w-full px-3 py-2 border rounded">
              <option value="">Select</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
            <input id="category" name="category" value={job.category} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="industry">Industry</label>
            <input id="industry" name="industry" value={job.industry} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="experienceLevel">Experience Level</label>
            <input id="experienceLevel" name="experienceLevel" value={job.experienceLevel} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="salaryMin">Salary Min</label>
            <input id="salaryMin" name="salaryMin" type="number" value={job.salaryMin} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="salaryMax">Salary Max</label>
            <input id="salaryMax" name="salaryMax" type="number" value={job.salaryMax} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="salaryCurrency">Salary Currency</label>
            <input id="salaryCurrency" name="salaryCurrency" value={job.salaryCurrency} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="applicationDeadline">Application Deadline</label>
            <input id="applicationDeadline" name="applicationDeadline" type="date" value={job.applicationDeadline} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="skills">Skills (comma separated)</label>
          <input id="skills" name="skills" value={job.skills} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={job.description} onChange={handleChange} required className="w-full px-3 py-2 border rounded" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="requirements">Requirements</label>
          <textarea id="requirements" name="requirements" value={job.requirements} onChange={handleChange} className="w-full px-3 py-2 border rounded" rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="responsibilities">Responsibilities</label>
          <textarea id="responsibilities" name="responsibilities" value={job.responsibilities} onChange={handleChange} className="w-full px-3 py-2 border rounded" rows={2} />
        </div>
        <div className="flex items-center">
          <input id="isFeatured" name="isFeatured" type="checkbox" checked={job.isFeatured} onChange={handleChange} className="mr-2" />
          <label htmlFor="isFeatured" className="text-sm font-medium">Featured Job</label>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default JobPost;
