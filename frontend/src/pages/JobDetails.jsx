
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ListChecks } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

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

  const matchScore = job.matchScore || job.aiMatchScore;
  const skills = job.skills || job.requiredSkills || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="relative mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 md:p-10">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-primary-100 shadow-lg dark:border-zinc-900 dark:bg-primary-900">
          <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0a4 4 0 01-8 0m8 0v2a4 4 0 01-8 0V7m8 0a4 4 0 00-8 0" /></svg>
        </div>
        <h1 className="mt-10 text-center text-2xl font-semibold text-zinc-900 dark:text-white md:text-3xl">
          {job.title}
        </h1>
        <p className="mt-1 text-center text-sm font-medium text-primary-600 dark:text-primary-400">
          {job.company}
        </p>
        <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
          {job.location} • {job.jobType}
        </p>

        {/* AI match insights */}
        {(matchScore != null || skills.length > 0) && (
          <div className="mt-6 rounded-xl border border-dashed border-primary-200 bg-primary-50/70 p-4 text-xs dark:border-primary-800 dark:bg-primary-950/40">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-primary-900 dark:text-primary-100">
                    AI match insights
                  </p>
                  <p className="text-[11px] text-primary-900/80 dark:text-primary-100/80">
                    Based on your profile and this role’s requirements.
                  </p>
                </div>
              </div>
              {matchScore != null && (
                <Badge
                  variant={matchScore >= 85 ? 'success' : 'secondary'}
                  className="shrink-0 text-[10px]"
                >
                  Match {matchScore}%
                </Badge>
              )}
            </div>
            {matchScore != null && (
              <div className="mt-3">
                <Progress value={matchScore} />
              </div>
            )}
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skills.slice(0, 6).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-[10px]">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 6 && (
                  <span className="text-[10px] text-primary-700 dark:text-primary-300">
                    +{skills.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
          <div>
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Description
              </h2>
              <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                {job.description}
              </p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <ListChecks className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                  Requirements
                </h2>
                <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex gap-1.5">
                      <span className="mt-1 h-1 w-1 rounded-full bg-gray-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        // ...existing code...
      </div>
    </div>
  </div>
  );
};

export default JobDetails;

