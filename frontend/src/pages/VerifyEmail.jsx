import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Email Verification</h2>
        <p className={`mb-6 ${status === 'success' ? 'text-green-600 dark:text-green-400' : status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>{message}</p>
        {status === 'success' && (
          <Link to="/login" className="inline-block bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">Go to Login</Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
