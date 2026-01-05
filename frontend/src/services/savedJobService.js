import api from './api';

export const savedJobService = {
  saveJob: async (jobId) => {
    const response = await api.post(`/saved-jobs/${jobId}`);
    return response.data;
  },
  unsaveJob: async (jobId) => {
    const response = await api.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },
  getSavedJobs: async () => {
    const response = await api.get('/saved-jobs');
    return response.data;
  },
  isJobSaved: async (jobId) => {
    const response = await api.get(`/saved-jobs/${jobId}/is-saved`);
    return response.data;
  },
};
