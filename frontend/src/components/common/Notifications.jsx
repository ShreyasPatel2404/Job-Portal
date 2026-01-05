import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(page, 10);
      setNotifications(response.content || []);
      setTotalPages(response.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    fetchNotifications();
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300 animate-pulse">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <ul className="space-y-3">
          {notifications.map(n => (
            <li key={n.id} className={`p-4 rounded shadow flex items-center justify-between ${n.read ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-primary-50 dark:bg-primary-900/20'}`}>
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{n.message}</div>
                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="space-x-2">
                {!n.read && <button onClick={() => handleMarkAsRead(n.id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Mark as Read</button>}
                <button onClick={() => handleDelete(n.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No notifications</div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition disabled:opacity-50">Previous</button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-200">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
