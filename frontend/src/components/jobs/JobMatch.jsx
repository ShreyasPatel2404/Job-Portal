import React, { useState } from 'react';
import { Upload, Target, Loader2, CheckCircle, AlertCircle, Briefcase, MapPin } from 'lucide-react';
import resumeService from '../../services/resumeService';
import matchService from '../../services/matchService';

const JobMatch = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [resumeId, setResumeId] = useState(null);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError(null);

        try {
            const filename = `resume_${Date.now()}.pdf`;
            const uploaded = await resumeService.uploadResume(file, filename, true);
            setResumeId(uploaded.id);
        } catch (err) {
            setError('Failed to upload and process resume. Ensure Ollama is running.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleMatch = async () => {
        if (!resumeId) return;
        setIsMatching(true);
        setError(null);

        try {
            const data = await matchService.matchJobs(resumeId);
            setResults(data);
        } catch (err) {
            setError('Error computing match scores.');
        } finally {
            setIsMatching(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Target className="text-blue-600" /> Semantic Job Matcher
                </h1>
                <p className="text-gray-600 mt-2">Upload your resume and let AI find your perfect role based on deep semantics.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-6">
                <div className="w-full max-w-md">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">{file ? file.name : 'Select Resume (PDF)'}</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading || resumeId}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 flex items-center gap-2"
                    >
                        {isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {resumeId ? 'Resume Processed' : 'Upload & Embed'}
                    </button>

                    <button
                        onClick={handleMatch}
                        disabled={!resumeId || isMatching}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isMatching ? <Loader2 className="animate-spin w-4 h-4" /> : <Target className="w-4 h-4" />}
                        Find My Matches
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((job, idx) => (
                        <div key={job.jobId} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 bg-blue-50 text-blue-700 font-bold rounded-bl-xl text-sm">
                                {job.matchScore}% Match
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.company}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                        <MapPin className="w-3 h-3" /> {job.location}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 h-1.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${job.matchScore}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobMatch;
