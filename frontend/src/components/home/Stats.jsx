import React from 'react';
import { Briefcase, Users, TrendingUp } from 'lucide-react';

export const Stats = () => {
    return (
        <section className="border-y border-border bg-card/50 backdrop-blur-sm relative z-10">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
                    <div className="text-center space-y-2 p-4">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-full mb-4">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold">10k+</h3>
                        <p className="text-muted-foreground">Active Jobs</p>
                    </div>
                    <div className="text-center space-y-2 p-4">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-full mb-4">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold">50k+</h3>
                        <p className="text-muted-foreground">Companies</p>
                    </div>
                    <div className="text-center space-y-2 p-4">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-full mb-4">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold">1M+</h3>
                        <p className="text-muted-foreground">Candidates</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
