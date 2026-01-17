import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { resumeService } from '../../services/resumeService';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, Check, Globe, File, Star, Plus } from 'lucide-react';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState({
    url: '',
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getMyResumes();
      setResumes(data);
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    try {
      await resumeService.uploadResume(resumeData);
      setResumeData({ url: '', title: '', description: '' });
      fetchResumes();
      setShowForm(false);
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resume?')) {
      await resumeService.deleteResume(id);
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  const handleSetDefault = async (id) => {
    await resumeService.setAsDefault(id);
    fetchResumes();
  };

  return (
    <DashboardLayout
      role="APPLICANT"
      title="Resume Manager"
      description="Manage your CVs and documents."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            My Resumes
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Resume</>}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 overflow-hidden"
              onSubmit={handleUpload}
            >
              <h3 className="text-lg font-semibold mb-4">Add New Resume</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="url">Resume URL (PDF/Doc)</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input id="url" name="url" value={resumeData.url} onChange={handleChange} required className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="https://..." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="title">Title</label>
                    <input id="title" name="title" value={resumeData.title} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. Frontend Dev Resume" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="description">Description</label>
                    <input id="description" name="description" value={resumeData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Optional notes" />
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">{error}</div>}
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={uploading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                    {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload Resume
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : resumes.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {resumes.map(resume => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={resume.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${resume.isDefault ? 'bg-primary/5 border-primary/20 dark:bg-primary/10' : 'bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 hover:border-primary/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${resume.isDefault ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
                      <File className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {resume.title}
                        {resume.isDefault && <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] uppercase tracking-wider font-bold">Default</span>}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{resume.description || 'No description'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
                        <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">View File</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!resume.isDefault && (
                      <button
                        onClick={() => handleSetDefault(resume.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Set as Default"
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/50">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No resumes found</h3>
            <p className="text-muted-foreground mb-4">Upload a resume to start applying for jobs.</p>
            <button onClick={() => setShowForm(true)} className="text-primary font-semibold hover:underline">Upload your first resume</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeManager;
