import React, { useEffect, useState } from 'react';
import { savedJobService } from '../services/savedJobService';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, MapPin, Building2, Briefcase, ArrowRight, Trash2, ArrowUpRight } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const data = await savedJobService.getSavedJobs();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    await savedJobService.unsaveJob(jobId);
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  return (
    <DashboardLayout
      role="APPLICANT"
      title="Saved Opportunities"
      description="Manage and review your bookmarked positions."
    >
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  key={job.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-5 hover:border-primary/50 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleUnsave(job.id)}
                      className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:bg-zinc-800 dark:hover:bg-red-900/20 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 group-hover:scale-105 transition-transform">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-medium">
                        {job.jobType}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mb-4">{job.company}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Briefcase className="w-3.5 h-3.5" />
                        {job.experienceLevel || "Not specified"}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:shadow-md"
                  >
                    View Details
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No saved jobs yet
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
              Jobs you bookmark will appear here. Start exploring opportunities to build your collection.
            </p>
            <Link to="/jobs">
              <Button>
                Explore Jobs
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedJobs;
