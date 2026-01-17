import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '../components/ui/toast';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('pending');
    try {
      await axios.post('/api/auth/reset-password', null, { params: { token, newPassword } });
      setStatus('success');
      toast({
        title: "Success",
        description: "Password reset successfully! Redirecting to login...",
        type: "success"
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to reset password. The link to reset your password may be invalid or expired.",
        type: "error"
      });
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="Please request a new password reset link.">
        <div className="text-center">
          <Link to="/request-password-reset">
            <Button className="w-full">
              Request New Link
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below."
    >
      {status === 'success' ? (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <h3 className="text-xl font-bold">Password Reset!</h3>
          <p className="text-muted-foreground">Redirecting you to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                minLength={8}
                required
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
          </div>

          <Button type="submit" className="w-full" disabled={status === 'pending'}>
            {status === 'pending' ? 'Resetting...' : 'Reset Password'}
            {!status === 'pending' && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
