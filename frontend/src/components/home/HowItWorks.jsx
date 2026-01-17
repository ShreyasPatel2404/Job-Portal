import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CloudUpload, Briefcase } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: 'Create Account',
        description: 'Sign up for free and set up your professional profile in minutes.',
        color: 'text-violet-500',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
        icon: CloudUpload,
        title: 'Upload Resume',
        description: 'Upload your CV and let our AI parse your skills and experience automatically.',
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
        icon: Briefcase,
        title: 'Apply to Jobs',
        description: 'Find your dream job and apply with a single click. Track your applications instantly.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
];

export const HowItWorks = () => {
    return (
        <section className="py-24 bg-white dark:bg-black/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                        How JobPortal Works
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Get hired in three simple steps. We've streamlined the process to help you find your next role faster.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-violet-200 via-blue-200 to-emerald-200 dark:from-violet-900/40 dark:via-blue-900/40 dark:to-emerald-900/40" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center mb-6 relative z-10 shadow-sm border border-white/50 dark:border-white/10`}>
                                <step.icon className={`w-10 h-10 ${step.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
