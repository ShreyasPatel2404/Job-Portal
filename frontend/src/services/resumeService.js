import api from './api';

export const resumeService = {
  uploadResume: async (resumeData) => {
    const response = await api.post('/resumes', resumeData);
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
};
