import React, { useEffect, useState } from 'react';
import { jobService } from '../services/jobService';
import { MainLayout } from '../components/layout/MainLayout';
import { Hero } from '../components/home/Hero';
import { Stats } from '../components/home/Stats';
import { FeaturedJobs } from '../components/home/FeaturedJobs';
import { HowItWorks } from '../components/home/HowItWorks';
import { Testimonials } from '../components/home/Testimonials';
import { Button } from '../components/ui/button';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const jobs = await jobService.getFeaturedJobs();
        setFeaturedJobs(jobs || []);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Hero />
        <Stats />
        <HowItWorks />
        <FeaturedJobs jobs={featuredJobs} loading={loading} />
        <Testimonials />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />

              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to take the next step?</h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg mb-8 relative z-10">
                Join thousands of professionals who have found their dream careers through JobPortal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Button size="lg" variant="secondary" className="text-primary font-bold shadow-lg">
                  Get Started Now
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-white/10 hover:text-white">
                  Post a Job
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;

