import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturedJobs = ({ jobs, loading }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-24 bg-secondary/30 relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Opportunities</h2>
                        <p className="text-muted-foreground max-w-xl">
                            Explore top-tier roles curated for your skillset. Our AI recommendation engine ensures you see what matters most.
                        </p>
                    </div>
                    <Link to="/jobs">
                        <Button variant="outline" className="group">
                            View All Jobs
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-xl bg-card animate-pulse border border-border" />
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {jobs.slice(0, 6).map((job) => (
                            <motion.div key={job.id} variants={item}>
                                <Card className="hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group cursor-pointer h-full flex flex-col">
                                    <Link to={`/jobs/${job.id}`} className="flex-1">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Building2 className="w-8 h-8 text-primary" />
                                                </div>
                                                <Badge variant="secondary" className="bg-secondary/50">{job.type || 'Full-time'}</Badge>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{job.title}</CardTitle>
                                            <CardDescription className="line-clamp-1">{job.company}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="mt-auto">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills?.slice(0, 3).map((skill, idx) => (
                                                    <Badge key={idx} variant="outline" className="border-border/50 bg-background/50">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground">No featured jobs available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
