import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/toast';
import { Select } from '../components/ui/select';
import { Mail, Lock, User, Briefcase, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'APPLICANT',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
      const response = await register(formData);
      addToast({
        title: "Account Created!",
        description: "You have successfully registered.",
        type: "success"
      });

      const accountType = response?.user?.accountType;
      if (accountType === 'EMPLOYER') {
        navigate('/dashboard/recruiter');
      } else if (accountType === 'APPLICANT') {
        navigate('/dashboard/jobseeker');
      } else if (accountType === 'ADMIN') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message
        || err.response?.data?.message
        || err.message
        || 'Registration failed. Please try again.';
      addToast({
        title: "Registration Failed",
        description: errorMessage,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your journey with us today"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Full Name"
              className="pl-10 h-11"
              value={formData.name}
              onChange={handleChange}
            />
            <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          </div>

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

          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Password (min 8 chars)"
              className="pl-10 h-11"
              value={formData.password}
              onChange={handleChange}
            />
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10 pointer-events-none">
              <Briefcase className="h-4 w-4" />
            </div>
            <Select
              id="accountType"
              name="accountType"
              required
              className="pl-10 h-11"
              value={formData.accountType}
              onChange={handleChange}
            >
              <option value="APPLICANT">Job Seeker</option>
              <option value="EMPLOYER">Recruiter / Employer</option>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-6"
          size="lg"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;

