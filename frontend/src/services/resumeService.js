import api from './api';

export const resumeService = {
  uploadResume: async ({ file, isDefault = true }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isDefault', String(isDefault));

    // The api interceptor will automatically handle FormData and remove Content-Type header
    const response = await api.post('/resumes', formData);
    return response.data;
  },
  getMyResumes: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },
  getResumeById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  getDefaultResume: async () => {
    const response = await api.get('/resumes/default');
    return response.data;
  },
  setAsDefault: async (id) => {
    const response = await api.put(`/resumes/${id}/default`);
    return response.data;
  },
  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
  searchResumes: async (query) => {
    const response = await api.get(`/resumes/search`, { params: { query } });
    return response.data;
  },
};
