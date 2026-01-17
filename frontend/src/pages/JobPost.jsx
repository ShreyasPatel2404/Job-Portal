import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { motion } from 'framer-motion';
import { Briefcase, Building2, MapPin, DollarSign, Calendar, Globe, Award, Sparkles, CheckCircle2 } from 'lucide-react';

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
  salaryCurrency: 'USD',
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

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400";
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2";

  return (
    <DashboardLayout
      role="EMPLOYER"
      title="Post a New Opportunity"
      description="Create a compelling job listing to attract the best talent."
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 sm:p-10 shadow-xl space-y-8" noValidate>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-200"
            >
              <div className="shrink-0 p-1 rounded-full bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-100">!</div>
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Core Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">
              Core Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses} htmlFor="title">
                  <Briefcase className="w-4 h-4 text-primary" /> Job Title <span className="text-red-500">*</span>
                </label>
                <input id="title" name="title" value={job.title} onChange={handleChange} required className={inputClasses} placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div>
                <label className={labelClasses} htmlFor="company">
                  <Building2 className="w-4 h-4 text-primary" /> Company Name <span className="text-red-500">*</span>
                </label>
                <input id="company" name="company" value={job.company} onChange={handleChange} required className={inputClasses} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className={labelClasses} htmlFor="companyLogo">
                  <Globe className="w-4 h-4 text-primary" /> Logo URL
                </label>
                <input id="companyLogo" name="companyLogo" type="url" value={job.companyLogo} onChange={handleChange} className={inputClasses} placeholder="https://..." />
              </div>
              <div>
                <label className={labelClasses} htmlFor="location">
                  <MapPin className="w-4 h-4 text-primary" /> Location <span className="text-red-500">*</span>
                </label>
                <input id="location" name="location" value={job.location} onChange={handleChange} required className={inputClasses} placeholder="e.g. San Francisco, CA (Remote)" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClasses} htmlFor="jobType">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select id="jobType" name="jobType" value={job.jobType} onChange={handleChange} required className={inputClasses}>
                  <option value="">Select Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className={labelClasses} htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <input id="category" name="category" value={job.category} onChange={handleChange} required className={inputClasses} placeholder="e.g. Engineering" />
              </div>
              <div>
                <label className={labelClasses} htmlFor="experienceLevel">
                  Experience
                </label>
                <input id="experienceLevel" name="experienceLevel" value={job.experienceLevel} onChange={handleChange} className={inputClasses} placeholder="e.g. 3+ Years" />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">
              Compensation & Timing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClasses} htmlFor="salaryMin">
                  <DollarSign className="w-4 h-4 text-primary" /> Salary Min
                </label>
                <input id="salaryMin" name="salaryMin" type="number" value={job.salaryMin} onChange={handleChange} className={inputClasses} placeholder="0" />
              </div>
              <div>
                <label className={labelClasses} htmlFor="salaryMax">
                  <DollarSign className="w-4 h-4 text-primary" /> Salary Max
                </label>
                <input id="salaryMax" name="salaryMax" type="number" value={job.salaryMax} onChange={handleChange} className={inputClasses} placeholder="0" />
              </div>
              <div>
                <label className={labelClasses} htmlFor="applicationDeadline">
                  <Calendar className="w-4 h-4 text-primary" /> Deadline
                </label>
                <input id="applicationDeadline" name="applicationDeadline" type="date" value={job.applicationDeadline} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-2">
              Role Description
            </h2>
            <div>
              <label className={labelClasses} htmlFor="skills">
                <Sparkles className="w-4 h-4 text-primary" /> Required Skills
              </label>
              <input id="skills" name="skills" value={job.skills} onChange={handleChange} className={inputClasses} placeholder="e.g. React, Node.js, AWS (Comma separated)" />
            </div>
            <div>
              <label className={labelClasses} htmlFor="description">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea id="description" name="description" value={job.description} onChange={handleChange} required className={`${inputClasses} min-h-[150px]`} placeholder="Detailed overview of the role..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses} htmlFor="requirements">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Requirements
                </label>
                <textarea id="requirements" name="requirements" value={job.requirements} onChange={handleChange} className={`${inputClasses} min-h-[120px]`} placeholder="Key qualifications..." />
              </div>
              <div>
                <label className={labelClasses} htmlFor="responsibilities">
                  <Award className="w-4 h-4 text-primary" /> Responsibilities
                </label>
                <textarea id="responsibilities" name="responsibilities" value={job.responsibilities} onChange={handleChange} className={`${inputClasses} min-h-[120px]`} placeholder="Core duties..." />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={job.isFeatured}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer select-none">
              Feature this job post (Higher visibility)
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-violet-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  <span>Publish Job Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default JobPost;
