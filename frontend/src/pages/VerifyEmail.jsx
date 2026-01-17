import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/button';
import { Mail, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    axios.get(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified! You can now log in.');
      })
      .catch(() => {
        setStatus('error');
        setMessage('Verification failed or link expired.');
      });
  }, [searchParams]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="We are verifying your email address."
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${status === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' :
              status === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' :
                'bg-primary/10 text-primary animate-pulse'
            }`}
        >
          {status === 'success' ? <CheckCircle className="w-10 h-10" /> :
            status === 'error' ? <XCircle className="w-10 h-10" /> :
              <Mail className="w-10 h-10" />}
        </motion.div>

        <div className="space-y-2">
          <h3 className={`text-xl font-bold ${status === 'success' ? 'text-green-600 dark:text-green-500' :
              status === 'error' ? 'text-red-600 dark:text-red-500' :
                'text-foreground'
            }`}>
            {status === 'success' ? 'Verified Successfully' :
              status === 'error' ? 'Verification Failed' :
                'Verifying...'}
          </h3>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {status === 'success' && (
          <Link to="/login" className="block pt-4">
            <Button className="w-full group">
              Go to Login
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}

        {status === 'error' && (
          <Link to="/login" className="block pt-4">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
