import api from './api';

const chatService = {
    sendMessage: async (message) => {
        try {
            const response = await api.post('/chat', { message });
            return response.data;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    }
};

export default chatService;
