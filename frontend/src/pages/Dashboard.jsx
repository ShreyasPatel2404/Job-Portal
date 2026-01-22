import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            // Redirect based on role
            switch (user.accountType) {
                case 'ADMIN':
                    navigate('/dashboard/admin', { replace: true });
                    break;
                case 'EMPLOYER':
                    navigate('/dashboard/recruiter', { replace: true });
                    break;
                case 'APPLICANT':
                    navigate('/dashboard/jobseeker', { replace: true });
                    break;
                default:
                    // Fallback or error
                    console.warn('Unknown role:', user.accountType);
                    navigate('/', { replace: true });
            }
        } else if (!loading && !user) {
            navigate('/login', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
};

export default Dashboard;
