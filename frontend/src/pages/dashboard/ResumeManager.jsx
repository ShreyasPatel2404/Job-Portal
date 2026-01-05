import React, { useEffect, useState } from 'react';
import { resumeService } from '../../services/resumeService';

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
    } catch (err) {
      setError('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resume?')) {
      await resumeService.deleteResume(id);
      fetchResumes();
    }
  };

  const handleSetDefault = async (id) => {
    await resumeService.setAsDefault(id);
    fetchResumes();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Resumes</h1>
      <form onSubmit={handleUpload} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="url">Resume URL</label>
          <input id="url" name="url" value={resumeData.url} onChange={handleChange} required className="w-full px-3 py-2 border rounded" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input id="title" name="title" value={resumeData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <input id="description" name="description" value={resumeData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading resumes...</div>
      ) : resumes.length > 0 ? (
        <div className="space-y-4">
          {resumes.map(resume => (
            <div key={resume.id} className={`p-4 rounded shadow flex items-center justify-between ${resume.isDefault ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-zinc-800'}`}>
              <div>
                <div className="font-semibold">{resume.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{resume.description}</div>
                <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">View Resume</a>
                {resume.isDefault && <span className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">Default</span>}
              </div>
              <div className="space-x-2">
                {!resume.isDefault && <button onClick={() => handleSetDefault(resume.id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Set Default</button>}
                <button onClick={() => handleDelete(resume.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No resumes uploaded</div>
      )}
    </div>
  );
};

export default ResumeManager;
