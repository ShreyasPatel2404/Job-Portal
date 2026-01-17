
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/toast';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      addToast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        type: "success"
      });
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message
        || err.response?.data?.message
        || err.message
        || 'Login failed. Please try again.';
      addToast({
        title: "Login Failed",
        description: errorMessage,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="pl-10 h-11"
                value={formData.email}
                onChange={handleChange}
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="pl-10 h-11"
                value={formData.password}
                onChange={handleChange}
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11"
          size="lg"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
        >
          Create one now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;

