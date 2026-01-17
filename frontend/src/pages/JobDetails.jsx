
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ListChecks, ArrowLeft, Building2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <span className="text-lg text-muted-foreground">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
        <div className="text-center p-8 glass-card rounded-2xl max-w-md w-full">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Job not found</h3>
          <p className="text-muted-foreground mb-6">This job posting may have been removed or expired.</p>
          <button onClick={() => navigate('/jobs')} className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  const matchScore = job.matchScore || job.aiMatchScore;
  const skills = job.skills || job.requiredSkills || [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to jobs
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl"
          >
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center border border-white/50 dark:border-white/10 shadow-inner">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Building2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {job.jobType}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Match */}
            {(matchScore != null || skills.length > 0) && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-violet-500/5 to-primary/5 border border-primary/10">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">AI Sustainability Match</h4>
                      <p className="text-xs text-muted-foreground">Analysis based on your profile.</p>
                    </div>
                  </div>
                  {matchScore != null && (
                    <Badge variant={matchScore >= 85 ? 'success' : 'secondary'} className="text-xs">
                      {matchScore}% Match
                    </Badge>
                  )}
                </div>
                {matchScore != null && <Progress value={matchScore} className="h-2 mb-4" />}

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 8).map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-foreground shadow-sm">
                        {skill}
                      </span>
                    ))}
                    {skills.length > 8 && <span className="text-xs text-muted-foreground self-center">+{skills.length - 8} more</span>}
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-10 md:grid-cols-[2fr,1.2fr]">
              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-foreground mb-3">About the Role</h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {job.description}
                  </div>
                </section>

                {job.requirements && job.requirements.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-primary" />
                      Requirements
                    </h2>
                    <ul className="space-y-2">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CheckCircle2 className="w-3 h-3" />
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                {isAuthenticated && user?.accountType === 'APPLICANT' ? (
                  <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-4">Apply Now</h3>

                    {successMsg && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm border border-green-200 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300">
                        {successMsg}
                      </motion.div>
                    )}
                    {errorMsg && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-300">
                        {errorMsg}
                      </motion.div>
                    )}

                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5" htmlFor="resumeUrl">Resume URL <span className="text-red-500">*</span></label>
                        <input
                          id="resumeUrl"
                          value={applicationData.resumeUrl}
                          onChange={(e) => setApplicationData({ ...applicationData, resumeUrl: e.target.value })}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5" htmlFor="coverLetter">Cover Letter</label>
                        <textarea
                          id="coverLetter"
                          value={applicationData.coverLetter}
                          onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all min-h-[100px] resize-y"
                          placeholder="Why are you a good fit?"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={applying}
                        className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </form>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-center">
                    <h3 className="font-semibold mb-2">Interested in this role?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Sign in to apply and track your application status.</p>
                    <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all">
                      Sign In to Apply
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetails;


