import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Calendar, Clock, Video, MoreHorizontal, Plus, Users, X } from 'lucide-react';
import { interviewService } from '../../services/interviewService';
import { useAuth } from '../../context/AuthContext';

const InterviewScheduler = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('upcoming');
    const [formData, setFormData] = useState({
        candidateEmail: '',
        jobTitle: '',
        scheduledTime: '',
        type: 'Video Call'
    });

    const filteredInterviews = interviews.filter(interview => {
        const interviewDate = new Date(interview.scheduledTime);
        const now = new Date();
        return filter === 'upcoming' ? interviewDate >= now : interviewDate < now;
    });

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const data = await interviewService.getMyInterviews();
            setInterviews(data);
        } catch (error) {
            console.error("Failed to fetch interviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await interviewService.scheduleInterview(formData);
            setShowModal(false);
            fetchInterviews();
            setFormData({ candidateEmail: '', jobTitle: '', scheduledTime: '', type: 'Video Call' });
        } catch (error) {
            alert("Failed to schedule interview: " + (error.response?.data?.message || error.message));
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this interview?")) {
            try {
                await interviewService.cancelInterview(id);
                fetchInterviews();
            } catch (error) {
                console.error("Failed to cancel interview", error);
            }
        }
    }

    return (
        <DashboardLayout role="EMPLOYER" title="Interview Scheduler" description="Manage your upcoming interviews.">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={() => setFilter('upcoming')} className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Upcoming</button>
                        <button onClick={() => setFilter('past')} className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${filter === 'past' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Past</button>
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm hover:shadow-md transition-all">
                        <Plus className="w-4 h-4" /> Schedule Interview
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" /> My Interviews
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading interviews...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {interviews.length === 0 && <div className="p-8 text-center text-gray-500">No interviews scheduled.</div>}
                            {interviews.map((interview) => (
                                <div key={interview.id} className="p-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex flex-col items-center justify-center font-bold text-xs">
                                            <span>{new Date(interview.scheduledTime).getDate()}</span>
                                            <span className="text-xs uppercase">{new Date(interview.scheduledTime).toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{interview.jobTitle}</h4>
                                            <p className="text-sm text-gray-500">with {user.role === 'EMPLOYER' ? 'Candidate' : 'Recruiter'}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(interview.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {interview.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {interview.status}
                                        </span>
                                        {user.role === 'EMPLOYER' && (
                                            <button onClick={() => handleCancel(interview.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Schedule Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 m-4 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Schedule Interview</h3>
                                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleSchedule} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Job Title</label>
                                    <input required className="w-full p-2 border rounded-lg" value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} placeholder="e.g. Frontend Developer" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Candidate Email</label>
                                    <input required type="email" className="w-full p-2 border rounded-lg" value={formData.candidateEmail} onChange={e => setFormData({ ...formData, candidateEmail: e.target.value })} placeholder="candidate@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date & Time</label>
                                    <input required type="datetime-local" className="w-full p-2 border rounded-lg" value={formData.scheduledTime} onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select className="w-full p-2 border rounded-lg" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option>Video Call</option>
                                        <option>Phone Interview</option>
                                        <option>On-site</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Schedule Interview</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InterviewScheduler;
