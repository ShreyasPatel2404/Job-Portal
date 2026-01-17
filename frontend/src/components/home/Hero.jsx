import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-24">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-1]">
                <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 max-w-3xl"
                >
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        New jobs added every minute
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white pb-2">
                        Find your dream job <br className="hidden sm:block" /> with <span className="text-primary">confidence</span>.
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                        Connect with thousands of top employers and discover opportunities that match your skills and aspirations.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-2xl mt-10"
                >
                    <div className="glass-panel p-2 rounded-2xl md:rounded-full border border-primary/10 shadow-lg shadow-primary/5 flex flex-col md:flex-row gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                className="w-full h-12 rounded-xl md:rounded-full bg-transparent pl-12 pr-4 outline-none placeholder:text-muted-foreground/70"
                            />
                        </div>
                        <div className="w-px h-8 bg-border hidden md:block my-auto" />
                        <div className="relative flex-1 group">
                            <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="City, state, or zip code"
                                className="w-full h-12 rounded-xl md:rounded-full bg-transparent pl-12 pr-4 outline-none placeholder:text-muted-foreground/70"
                            />
                        </div>
                        <Button size="lg" className="rounded-xl md:rounded-full h-12 px-8 text-base">
                            Search Jobs
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 flex flex-wrap justify-center gap-4"
                >
                    <p className="text-sm text-muted-foreground w-full mb-2">Popular searches:</p>
                    {['Remote', 'Product Design', 'Software Engineer', 'Marketing', 'Data Science'].map((tag) => (
                        <Link
                            key={tag}
                            to={`/jobs?q=${tag}`}
                            className="px-4 py-2 rounded-full border border-border bg-background hover:bg-muted hover:border-primary/50 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            {tag}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
