import api from './api';

export const jobService = {
  getAllJobs: async (page = 0, size = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    // Only add non-empty filter values
    if (filters.location && filters.location.trim()) {
      params.append('location', filters.location.trim());
    }
    if (filters.jobType && filters.jobType.trim()) {
      params.append('jobType', filters.jobType.trim());
    }
    if (filters.category && filters.category.trim()) {
      params.append('category', filters.category.trim());
    }
    
    const response = await api.get(`/jobs?${params}`);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async (page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    const response = await api.get(`/jobs/my-jobs?${params}`);
    return response.data;
  },

  getFeaturedJobs: async () => {
    const response = await api.get('/jobs/featured');
    return response.data;
  },

  searchJobs: async (query, page = 0, size = 10) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      size: size.toString(),
    });
    const response = await api.get(`/jobs/search?${params}`);
    return response.data;
  },
};

