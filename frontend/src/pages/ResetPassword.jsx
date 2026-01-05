import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('pending');
    setMessage('');
    try {
      await axios.post('/api/auth/reset-password', null, { params: { token, newPassword } });
      setStatus('success');
      setMessage('Password reset successfully! You can now log in.');
    } catch {
      setStatus('error');
      setMessage('Failed to reset password. The link may be invalid or expired.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-md w-full bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Reset Password</h2>
          <p className="text-red-600 dark:text-red-400">Invalid or missing reset token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && <p className={`mt-4 ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>}
        {status === 'success' && (
          <Link to="/login" className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">Go to Login</Link>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
