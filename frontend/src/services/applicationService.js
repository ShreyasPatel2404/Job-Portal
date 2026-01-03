import api from './api';

export const applicationService = {
  applyToJob: async (jobId, applicationData) => {
    const response = await api.post(`/applications/job/${jobId}`, applicationData);
    return response.data;
  },

  getMyApplications: async (page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    const response = await api.get(`/applications?${params}`);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  getJobApplications: async (jobId, page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    const response = await api.get(`/applications/job/${jobId}?${params}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status, notes = null, rejectionReason = null) => {
    const params = new URLSearchParams({ status });
    if (notes) params.append('notes', notes);
    if (rejectionReason) params.append('rejectionReason', rejectionReason);
    const response = await api.put(`/applications/${id}/status?${params}`);
    return response.data;
  },

  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  getApplicationsByStatus: async (status) => {
    const response = await api.get(`/applications/status/${status}`);
    return response.data;
  },
};

