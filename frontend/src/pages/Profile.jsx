import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Edit2 } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout title="My Profile" description="Manage your account settings and preferences.">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div className="px-8 pb-8 relative">
                        <div className="absolute -top-16 left-8 p-1.5 bg-white rounded-full">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative group cursor-pointer">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-gray-300">{user?.name?.charAt(0)}</span>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="ml-40 pt-2 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-gray-500">{user?.email}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">
                                <Edit2 className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" /> Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                <div className="text-gray-900 font-medium">{user?.name}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                    <Mail className="w-4 h-4 text-gray-400" /> {user?.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-gray-400" /> Account Security
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Account Role</label>
                                <div className="text-gray-900 font-medium">{user?.role}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Password</label>
                                <button className="text-blue-600 hover:underline text-sm font-medium">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
