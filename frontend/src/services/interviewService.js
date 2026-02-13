import api from './api';

export const interviewService = {
    scheduleInterview: async (interviewData) => {
        const response = await api.post('/interviews', interviewData);
        return response.data;
    },
    getMyInterviews: async () => {
        const response = await api.get('/interviews/my-interviews');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.put(`/interviews/${id}/status`, null, { params: { status } });
        return response.data;
    },
    cancelInterview: async (id) => {
        await api.delete(`/interviews/${id}`);
    },
};
