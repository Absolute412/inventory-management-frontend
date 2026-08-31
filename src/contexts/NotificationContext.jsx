import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "../lib/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    setLoadingNotifications(true);

    try {
      const response = await axios.get("/notifications");
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoadingNotifications(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchNotifications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchNotifications]);

  const markNotificationRead = useCallback(
    async (id) => {
      const notification = notifications.find((item) => item.id === id);
      if (!notification || notification.read) return;

      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
      );

      try {
        await axios.patch(`/notifications/${id}/read`);
      } catch (error) {
        setNotifications((current) =>
          current.map((item) => (item.id === id ? notification : item)),
        );
        throw error;
      }
    },
    [notifications],
  );

  const markAllNotificationsRead = useCallback(async () => {
    const previousNotifications = notifications;
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );

    try {
      await axios.patch("/notifications/read-all");
    } catch (error) {
      setNotifications(previousNotifications);
      throw error;
    }
  }, [notifications]);

  const deleteNotification = useCallback(
    async (id) => {
      const notification = notifications.find((item) => item.id === id);
      if (!notification) return;

      setNotifications((current) => current.filter((item) => item.id !== id));

      try {
        await axios.delete(`/notifications/${id}`);
      } catch (error) {
        setNotifications((current) => {
          if (current.some((item) => item.id === id)) return current;

          return [...current, notification].sort(
            (first, second) =>
              new Date(second.createdAt) - new Date(first.createdAt),
          );
        });
        throw error;
      }
    },
    [notifications],
  );

  const deleteAllNotifications = useCallback(async () => {
    const previousNotifications = notifications;
    setNotifications([]);

    try {
      await axios.delete("/notifications/");
    } catch (error) {
      setNotifications(previousNotifications);
      throw error;
    }
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read)
        .length,
      loadingNotifications,
      fetchNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      deleteAllNotifications,
    }),
    [
      notifications,
      loadingNotifications,
      fetchNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      deleteAllNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };
