import api from './api';

export const notificationService = {
  getNotifications: async (page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },
  getUnreadNotifications: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
