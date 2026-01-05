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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Company Reviews</h1>
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="p-4 rounded shadow bg-white dark:bg-zinc-800">
              <div className="font-semibold">{review.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{review.comment}</div>
              <div className="text-xs text-gray-400">By {review.author} on {new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No reviews yet</div>
      )}
    </div>
  );
};

export default CompanyReviews;
