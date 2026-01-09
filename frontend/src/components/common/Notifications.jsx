
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
    <section
      aria-labelledby="notifications-heading"
      className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <h2
        id="notifications-heading"
        className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100"
      >
        Notifications
      </h2>
      {loading ? (
        <div
          className="text-center py-12 text-gray-500 dark:text-gray-300 animate-pulse"
          role="status"
          aria-live="polite"
        >
          Loading notifications...
        </div>
      ) : notifications.length > 0 ? (
        <ul className="space-y-4" aria-live="polite">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded-lg shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${n.read ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-primary-50 dark:bg-primary-900/20'}`}
              tabIndex={0}
              aria-label={n.title}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-base text-gray-900 dark:text-gray-100 mb-1">{n.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{n.message}</div>
                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 text-xs transition"
                    aria-label="Mark as read"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 text-xs transition"
                  aria-label="Delete notification"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400" role="status">
          No notifications
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-8 flex justify-center items-center gap-2"
          aria-label="Notifications pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-200 select-none">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border rounded bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
};

export default Notifications;
