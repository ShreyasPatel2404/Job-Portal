import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { useToast } from '../components/ui/toast';
import { User, Lock, Bell, Trash2 } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        jobAlerts: true,
        marketing: false,
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            addToast({
                title: "Profile Updated",
                description: "Your profile information has been saved.",
                type: "success"
            });
        }, 1000);
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Profile Information</CardTitle>
                            </div>
                            <CardDescription>Update your profile details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                    <Input
                                        id="email"
                                        value={profileData.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Password Section - Placeholder */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                <CardTitle>Security</CardTitle>
                            </div>
                            <CardDescription>Manage your password and security questions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Password</p>
                                    <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                                </div>
                                <Button variant="outline">Change Password</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle>Notifications</CardTitle>
                            </div>
                            <CardDescription>Choose what updates you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Email Updates</label>
                                    <p className="text-xs text-muted-foreground">Receive daily summaries of your activity.</p>
                                </div>
                                <div
                                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifications.emailUpdates ? 'bg-primary' : 'bg-input'}`}
                                    onClick={() => toggleNotification('emailUpdates')}
                                >
                                    <div className={`bg-background w-4 h-4 rounded-full shadow transform transition-transform ${notifications.emailUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Job Alerts</label>
                                    <p className="text-xs text-muted-foreground">Get notified when new jobs match your profile.</p>
                                </div>
                                <div
                                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifications.jobAlerts ? 'bg-primary' : 'bg-input'}`}
                                    onClick={() => toggleNotification('jobAlerts')}
                                >
                                    <div className={`bg-background w-4 h-4 rounded-full shadow transform transition-transform ${notifications.jobAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                <CardTitle>Danger Zone</CardTitle>
                            </div>
                            <CardDescription>Irreversible actions for your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                <div>
                                    <p className="font-medium text-destructive">Delete Account</p>
                                    <p className="text-sm text-destructive/80">Permanently remove your account and all data.</p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
