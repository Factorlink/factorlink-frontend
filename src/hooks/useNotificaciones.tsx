import { useCallback, useState } from "react";
import api from "../lib/axios";
import type { NotificacionesResponse } from "../types/notificacion";

export const useNotificaciones = () => {
  const [loading, setLoading] = useState(false);

  const getUnread = useCallback(
    async (userId: string): Promise<NotificacionesResponse> => {
      try {
        setLoading(true);
        const response = await api.get(
          `notificaciones/users/${userId}/unread`,
        );
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getRead = useCallback(
    async (userId: string): Promise<NotificacionesResponse> => {
      try {
        setLoading(true);
        const response = await api.get(`notificaciones/users/${userId}/read`);
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const markAsRead = useCallback(
    async (notificationId: string, userId: string) => {
      try {
        setLoading(true);
        const response = await api.put(
          `notificaciones/${notificationId}/read`,
          { userId },
        );
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    getUnread,
    getRead,
    markAsRead,
  };
};
