import api from './api';

export const fetchCompanyReviews = async (companyId) => {
  const res = await api.get(`/api/companies/${companyId}/reviews`);
  return res.data;
};

export const submitCompanyReview = async (companyId, review) => {
  const res = await api.post(`/api/companies/${companyId}/reviews`, review);
  return res.data;
};
