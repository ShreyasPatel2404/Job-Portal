import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            {/* Left: Content */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-20 relative">
                <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                            <Briefcase className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">JobPortal</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm mx-auto space-y-6"
                >
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </motion.div>
            </div>

            {/* Right: Decorative Image/Gradient */}
            <div className="hidden lg:block relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-blue-600">
                    {/* Abstract shapes or pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-white p-12 text-center">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-4xl font-bold">Find your dream job today.</h2>
                        <p className="text-lg text-white/80">Connect with thousands of employers and opportunities.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
