import api from './api';

const matchService = {
    matchJobs: async (resumeId) => {
        try {
            const response = await api.post(`/match-jobs?resumeId=${resumeId}`);
            return response.data;
        } catch (error) {
            console.error('Matching error:', error);
            throw error;
        }
    }
};

export default matchService;
