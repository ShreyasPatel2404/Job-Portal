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
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Post a New Job</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Create a job listing to attract top talent
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6" noValidate>
        {error && (
          <div 
            role="alert" 
            aria-live="polite"
            className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          >
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="title">
              Job Title <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input 
              id="title" 
              name="title" 
              value={job.title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="company">
              Company <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input 
              id="company" 
              name="company" 
              value={job.company} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="companyLogo">
              Company Logo URL
            </label>
            <input 
              id="companyLogo" 
              name="companyLogo" 
              type="url"
              value={job.companyLogo} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="location">
              Location <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input 
              id="location" 
              name="location" 
              value={job.location} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="jobType">
              Job Type <span className="text-red-500" aria-label="required">*</span>
            </label>
            <select 
              id="jobType" 
              name="jobType" 
              value={job.jobType} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow cursor-pointer"
            >
              <option value="">Select job type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="category">
              Category <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input 
              id="category" 
              name="category" 
              value={job.category} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="industry">
              Industry
            </label>
            <input 
              id="industry" 
              name="industry" 
              value={job.industry} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="experienceLevel">
              Experience Level
            </label>
            <input 
              id="experienceLevel" 
              name="experienceLevel" 
              value={job.experienceLevel} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
              placeholder="e.g. Mid-level, Senior"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="salaryMin">
              Salary Min
            </label>
            <input 
              id="salaryMin" 
              name="salaryMin" 
              type="number" 
              value={job.salaryMin} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="salaryMax">
              Salary Max
            </label>
            <input 
              id="salaryMax" 
              name="salaryMax" 
              type="number" 
              value={job.salaryMax} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="salaryCurrency">
              Salary Currency
            </label>
            <input 
              id="salaryCurrency" 
              name="salaryCurrency" 
              value={job.salaryCurrency} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
              placeholder="USD, EUR, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="applicationDeadline">
              Application Deadline
            </label>
            <input 
              id="applicationDeadline" 
              name="applicationDeadline" 
              type="date" 
              value={job.applicationDeadline} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="skills">
            Skills <span className="text-xs font-normal text-gray-500">(comma separated)</span>
          </label>
          <input 
            id="skills" 
            name="skills" 
            value={job.skills} 
            onChange={handleChange} 
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
            placeholder="React, Node.js, TypeScript"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="description">
            Description <span className="text-red-500" aria-label="required">*</span>
          </label>
          <textarea 
            id="description" 
            name="description" 
            value={job.description} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-y" 
            rows={4}
            placeholder="Describe the role and what makes it exciting..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="requirements">
            Requirements
          </label>
          <textarea 
            id="requirements" 
            name="requirements" 
            value={job.requirements} 
            onChange={handleChange} 
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-y" 
            rows={3}
            placeholder="List the key requirements for this role..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" htmlFor="responsibilities">
            Responsibilities
          </label>
          <textarea 
            id="responsibilities" 
            name="responsibilities" 
            value={job.responsibilities} 
            onChange={handleChange} 
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-y" 
            rows={3}
            placeholder="Describe the day-to-day responsibilities..."
          />
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
          <input 
            id="isFeatured" 
            name="isFeatured" 
            type="checkbox" 
            checked={job.isFeatured} 
            onChange={handleChange} 
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-zinc-700" 
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
            Feature this job on the homepage
          </label>
        </div>
        <button 
          type="submit" 
          className="w-full flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md" 
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Posting...</span>
            </>
          ) : (
            'Post Job'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobPost;
