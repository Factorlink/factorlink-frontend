import { useCallback, useState } from "react";
import api from "../lib/axios";
import type {
  NotificacionContext,
  NotificacionesResponse,
} from "../types/notificacion";

export type { NotificacionContext };

const toQueryParams = (context: NotificacionContext) => {
  if (context.empresaId) return { empresaId: context.empresaId };
  if (context.factoringId) return { factoringId: context.factoringId };
  return {};
};

export const useNotificaciones = () => {
  const [loading, setLoading] = useState(false);

  const getUnread = useCallback(
    async (
      userId: string,
      context: NotificacionContext,
    ): Promise<NotificacionesResponse> => {
      try {
        setLoading(true);
        const response = await api.get(
          `notificaciones/users/${userId}/unread`,
          { params: toQueryParams(context) },
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
    async (
      userId: string,
      context: NotificacionContext,
    ): Promise<NotificacionesResponse> => {
      try {
        setLoading(true);
        const response = await api.get(
          `notificaciones/users/${userId}/read`,
          { params: toQueryParams(context) },
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

  const markAsRead = useCallback(
    async (
      notificationId: string,
      userId: string,
      context: NotificacionContext,
    ) => {
      try {
        setLoading(true);
        const response = await api.put(
          `notificaciones/${notificationId}/read`,
          { userId },
          { params: toQueryParams(context) },
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
