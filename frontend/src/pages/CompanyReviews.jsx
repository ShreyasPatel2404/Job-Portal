import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CompanyReviews = () => {
  const { companyId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch company reviews from backend
    setLoading(false);
  }, [companyId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Company Reviews</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Read what others are saying about this company
        </p>
      </div>
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <article 
              key={idx} 
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {review.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {review.comment}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <span>By {review.author}</span>
                <span aria-hidden="true">•</span>
                <time dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-md px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
              No reviews yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Be the first to share your experience with this company.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyReviews;
