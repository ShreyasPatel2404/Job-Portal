import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { jobService } from '../../services/jobService';
import { Plus, Search, MapPin, Users, Calendar, MoreVertical, Briefcase, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/ui/toast';

const EmployerJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, closed
    const { addToast } = useToast();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobService.getMyJobs();
            setJobs(data.content || data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            addToast({
                title: "Error",
                description: "Failed to load jobs",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the job post "${title}"? This action cannot be undone.`)) {
            try {
                await jobService.deleteJob(id);
                addToast({
                    title: "Success",
                    description: "Job deleted successfully",
                    type: "success"
                });
                fetchJobs(); // Refresh the list
            } catch (error) {
                console.error("Failed to delete job", error);
                addToast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to delete job",
                    type: "error"
                });
            }
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (filter === 'all') return true;
        return job.status?.toLowerCase() === filter;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <DashboardLayout
            role="EMPLOYER"
            title="My Jobs"
            description="Manage your job postings and track their performance."
        >
            <div className="space-y-6">
                {/* Actions & Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-zinc-800">
                        {['all', 'active', 'closed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f
                                    ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    <Link
                        to="/jobs/post"
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post New Job</span>
                    </Link>
                </div>

                {/* Job List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading jobs...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No jobs found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first job posting</p>
                        <Link
                            to="/jobs/post"
                            className="text-primary font-medium hover:underline"
                        >
                            Post a Job
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4"
                    >
                        {filteredJobs.map((job) => (
                            <motion.div
                                variants={item}
                                key={job.id}
                                className="group relative bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-primary/50 transition-all hover:shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                {job.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${job.status === 'active'
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700'
                                                }`}>
                                                {job.status?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Posted {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-6 px-4 py-2 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-0.5">Applicants</p>
                                                <p className="font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-primary" />
                                                    {job.applicationCount || 0}
                                                </p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700" />
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 mb-0.5">Views</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {job.views || 0}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/employer/jobs/${job.id}/applicants`}
                                                className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                                            >
                                                Manage
                                            </Link>
                                            <Link
                                                to={`/jobs/edit/${job.id}`}
                                                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                title="Edit Job"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(job.id, job.title)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default EmployerJobs;
