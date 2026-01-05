import React, { useState } from 'react';
import axios from 'axios';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('pending');
    setMessage('');
    try {
      await axios.post('/api/auth/request-password-reset', null, { params: { email } });
      setStatus('success');
      setMessage('Password reset email sent! Check your inbox.');
    } catch {
      setStatus('error');
      setMessage('Failed to send reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Forgot Password?</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        {message && <p className={`mt-4 ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default RequestPasswordReset;
