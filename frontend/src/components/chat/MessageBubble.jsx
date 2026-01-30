import React from 'react';
import { Bot, User, Briefcase, HelpCircle, FileText, Lightbulb, Compass, Target, Users, TrendingUp, DollarSign, ListChecks } from 'lucide-react';

const MessageBubble = ({ message }) => {
    const isAi = message.sender === 'ai';

    const renderIcon = () => {
        if (!isAi) return <User className="w-5 h-5 text-gray-600" />;

        switch (message.intent) {
            case 'JOB_SEARCH': return <Briefcase className="w-5 h-5 text-blue-500" />;
            case 'RESUME_ADVICE': return <FileText className="w-5 h-5 text-purple-500" />;
            case 'INTERVIEW_QUESTIONS': return <HelpCircle className="w-5 h-5 text-green-500" />;
            case 'SKILL_RECOMMENDATION': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
            case 'CAREER_GUIDANCE': return <Compass className="w-5 h-5 text-orange-500" />;
            case 'RESUME_JOB_MATCH': return <Target className="w-5 h-5 text-purple-500" />;
            case 'CANDIDATE_SEARCH': return <Users className="w-5 h-5 text-green-500" />;
            case 'JOB_TREND_ANALYSIS': return <TrendingUp className="w-5 h-5 text-indigo-500" />;
            case 'SALARY_INSIGHT': return <DollarSign className="w-5 h-5 text-emerald-500" />;
            case 'APPLICATION_HELP': return <ListChecks className="w-5 h-5 text-rose-500" />;
            default: return <Bot className="w-5 h-5 text-blue-500" />;
        }
    };

    const renderData = () => {
        if (!message.data || message.data.length === 0) return null;

        switch (message.intent) {
            case 'JOB_SEARCH':
                return (
                    <div className="mt-3 space-y-2">
                        {message.data.map((job, idx) => (
                            <div key={idx} className="p-2 bg-white/50 rounded border border-blue-100 text-sm">
                                <div className="font-semibold text-blue-700">{job.title}</div>
                                <div className="text-gray-600">{job.company} • {job.location}</div>
                                <div className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">View Details</div>
                                <div className="text-[10px] text-gray-400 mt-1">ID: {job.id}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'RESUME_JOB_MATCH':
                const matchData = message.data[0];
                return (
                    <div className="mt-3 p-3 bg-white/50 rounded-xl border border-purple-100 min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-purple-700">Match Score</span>
                            <span className="text-lg font-bold text-purple-600">{matchData.matchScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                            <div
                                className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000"
                                style={{ width: `${matchData.matchScore}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1 font-medium">Target: {matchData.jobTitle}</div>
                    </div>
                );
            case 'JOB_TREND_ANALYSIS':
                const trends = message.data[0]?.trends || [];
                return (
                    <div className="mt-3 p-3 bg-white/50 rounded-xl border border-indigo-100">
                        <div className="text-xs font-bold text-indigo-500 uppercase mb-2">Trending Skills</div>
                        <div className="flex flex-wrap gap-2">
                            {trends.map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs border border-indigo-100">
                                    #{skill}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            case 'SALARY_INSIGHT':
                const insight = message.data[0] || {};
                return (
                    <div className="mt-3 p-3 bg-white/50 rounded-xl border border-emerald-100">
                        <div className="text-xs font-bold text-emerald-500 uppercase mb-2">Market Analysis</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                <div className="text-[10px] text-emerald-600 uppercase">Avg Min</div>
                                <div className="text-sm font-bold text-emerald-800">${(insight.avgMin || 0).toLocaleString()}</div>
                            </div>
                            <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                <div className="text-[10px] text-emerald-600 uppercase">Avg Max</div>
                                <div className="text-sm font-bold text-emerald-800">${(insight.avgMax || 0).toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 italic">Based on {insight.sampleSize || 0} real job listings</div>
                    </div>
                );
            case 'APPLICATION_HELP':
                const appIntel = message.data[0] || {};
                return (
                    <div className="mt-3 p-3 bg-white/50 rounded-xl border border-rose-100 min-w-[220px]">
                        <div className="text-xs font-bold text-rose-500 uppercase mb-2">Application Intelligence</div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total Applications</span>
                                <span className="font-bold text-gray-800">{appIntel.totalApplications}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                                    <div className="text-[10px] text-rose-600 uppercase">Conversion</div>
                                    <div className="text-sm font-bold text-rose-900">{appIntel.conversionRate}%</div>
                                </div>
                                <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                                    <div className="text-[10px] text-rose-600 uppercase">Pending</div>
                                    <div className="text-sm font-bold text-rose-900">{appIntel.pendingReview}</div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-rose-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-gray-500 uppercase">Resume Quality</span>
                                    <span className="text-[10px] font-bold text-rose-600">{appIntel.resumeQualityScore}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${appIntel.resumeQualityScore}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'CANDIDATE_SEARCH':
                return (
                    <div className="mt-3 space-y-2">
                        {message.data.map((candidate, idx) => (
                            <div key={idx} className="p-3 bg-white/50 rounded border border-green-100 text-sm">
                                <div className="font-semibold text-green-700">{candidate.name}</div>
                                <div className="text-gray-600">{candidate.skills?.slice(0, 3).join(', ')}...</div>
                                <div className="text-xs text-green-500 mt-1 cursor-pointer hover:underline">View Profile</div>
                            </div>
                        ))}
                    </div>
                );
            case 'INTERVIEW_QUESTIONS':
            case 'SKILL_RECOMMENDATION':
                return (
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                        {message.data.map((item, idx) => (
                            <li key={idx} className="text-gray-700">{item}</li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex w-full mb-4 ${isAi ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAi ? 'bg-blue-50 ml-0 mr-2' : 'bg-gray-100 mr-0 ml-2'}`}>
                    {renderIcon()}
                </div>
                <div className={`p-3 rounded-2xl shadow-sm ${isAi
                    ? 'bg-gradient-to-br from-white to-blue-50 text-gray-800 rounded-tl-none border border-blue-100'
                    : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                    {renderData()}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
