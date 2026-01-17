import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Building2, UserCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';

const CompanyReviews = () => {
  const { companyId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch company reviews from backend
    setLoading(false);
  }, [companyId]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.02] bg-[bottom_1px_center] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Company Reviews
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              See what employees are saying about their experience.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
              <p className="text-sm text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <motion.article
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <UserCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{review.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{review.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-12 border-l-2 border-primary/20">
                    {review.comment}
                  </p>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-16 text-center border-dashed"
            >
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No reviews yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to share your experience working with this company. Your insights help others make better career decisions.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyReviews;
