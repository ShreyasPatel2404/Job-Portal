import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Search, Filter, FileText, Download, User, MapPin, Briefcase } from 'lucide-react';
import { resumeService } from '../../services/resumeService';

const ResumeDatabase = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await resumeService.searchResumes(searchQuery);
            setCandidates(data);
        } catch (error) {
            console.error("Failed to search resumes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else if (searchQuery.length === 0) {
            setCandidates([]);
        }
    }, [searchQuery]);

    return (
        <DashboardLayout role="EMPLOYER" title="Resume Database" description="Search and discover top talent.">
            <div className="space-y-6">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by keywords (e.g. Java, React)..."
                        className="flex-1 outline-none text-sm text-gray-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                        Search
                    </button>
                </div>

                {/* Candidate List */}
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="grid gap-4">
                        {candidates.length === 0 && searchQuery.length > 0 && <div className="text-center py-10 text-gray-500">No candidates found matching "{searchQuery}"</div>}
                        {candidates.map(resume => (
                            <div key={resume.id} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                            {/* Fallback initial if user name not populated in resume projection */}
                                            R
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Resume #{resume.id.substring(0, 8)}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                                <Briefcase className="w-3.5 h-3.5" /> {resume.fileName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => alert("Profile view coming soon!")} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                                            <User className="w-5 h-5" />
                                        </button>
                                        <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download Resume">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-600 line-clamp-3">
                                    {resume.text ? resume.text.substring(0, 200) + "..." : "No text preview available."}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ResumeDatabase;
