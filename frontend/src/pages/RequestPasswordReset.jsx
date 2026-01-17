import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/ui/toast';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('pending');
    try {
      await axios.post('/api/auth/request-password-reset', null, { params: { email } });
      setStatus('success');
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
        type: "success"
      });
    } catch {
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        type: "error"
      });
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email to receive reset instructions."
    >
      {status === 'success' ? (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Check your inbox</h3>
            <p className="text-muted-foreground">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>
          <Link to="/login" className="block pt-2">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={status === 'pending'}>
            {status === 'pending' ? 'Sending...' : 'Send Reset Email'}
            {!status === 'pending' && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default RequestPasswordReset;
