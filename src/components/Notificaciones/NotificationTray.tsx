import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Tab, Tabs, Typography } from "@mui/material";
import type { Notificacion } from "../../types/notificacion";
import type { Role } from "../../types/role";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { useOfertas } from "../../hooks/useOfertas";
import {
  getNotificationRoute,
  isOfertaNotification,
  sortReadNotifications,
  sortUnreadNotifications,
} from "../../utils/notificationHelpers";
import NotificationItem from "./NotificationItem";
import {
  NotificationEmptyState,
  NotificationErrorState,
  NotificationLoadingState,
} from "./NotificationStates";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

interface NotificationTrayProps {
  userId: string;
  currentRole: Role | null;
  open: boolean;
  unreadCount: number;
  onUnreadCountChange: (count: number) => void;
  onClose: () => void;
}

const NotificationTray: FC<NotificationTrayProps> = ({
  userId,
  currentRole,
  open,
  unreadCount,
  onUnreadCountChange,
  onClose,
}) => {
  const navigate = useNavigate();
  const { getUnread, getRead, markAsRead } = useNotificaciones();
  const { getOfertaById } = useOfertas();

  const [tabValue, setTabValue] = useState(0);
  const [unread, setUnread] = useState<Notificacion[]>([]);
  const [read, setRead] = useState<Notificacion[]>([]);
  const [loadingUnread, setLoadingUnread] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);
  const [errorUnread, setErrorUnread] = useState(false);
  const [errorRead, setErrorRead] = useState(false);
  const [hasLoadedRead, setHasLoadedRead] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUnread = useCallback(async () => {
    try {
      setLoadingUnread(true);
      setErrorUnread(false);
      const data = await getUnread(userId);
      const sorted = sortUnreadNotifications(data.notifications ?? []);
      setUnread(sorted);
      onUnreadCountChange(data.count ?? sorted.length);
    } catch {
      setErrorUnread(true);
    } finally {
      setLoadingUnread(false);
    }
  }, [getUnread, onUnreadCountChange, userId]);

  const fetchRead = useCallback(async () => {
    try {
      setLoadingRead(true);
      setErrorRead(false);
      const data = await getRead(userId);
      setRead(sortReadNotifications(data.notifications ?? []));
      setHasLoadedRead(true);
    } catch {
      setErrorRead(true);
    } finally {
      setLoadingRead(false);
    }
  }, [getRead, userId]);

  useEffect(() => {
    if (!open) return;
    setActionError(null);
    fetchUnread();
  }, [open, fetchUnread]);

  useEffect(() => {
    if (!open || tabValue !== 1 || hasLoadedRead) return;
    fetchRead();
  }, [open, tabValue, hasLoadedRead, fetchRead]);

  const handleTabChange = (_: SyntheticEvent, nextValue: number) => {
    setTabValue(nextValue);
    setActionError(null);
  };

  const handleNotificationClick = async (notification: Notificacion) => {
    setActionError(null);
    setMarkingId(notification.id);

    try {
      const ofertaPromise =
        isOfertaNotification(notification.tipo) && notification.entidadId
          ? getOfertaById(notification.entidadId).catch(() => null)
          : Promise.resolve(null);
      const readPromise = !notification.leida
        ? markAsRead(notification.id, userId)
        : Promise.resolve();

      const [oferta] = await Promise.all([ofertaPromise, readPromise]);

      if (!notification.leida) {
        setUnread((prev) => prev.filter((item) => item.id !== notification.id));
        onUnreadCountChange(Math.max(0, unreadCount - 1));
        setHasLoadedRead(false);
      }

      const route = getNotificationRoute(
        notification,
        currentRole,
        oferta?.facturaId,
      );
      if (route) {
        onClose();
        navigate(route);
      }
    } catch {
      setActionError(
        "No pudimos marcar la notificación como leída. Intenta nuevamente.",
      );
    } finally {
      setMarkingId(null);
    }
  };

  const renderUnreadContent = () => {
    if (loadingUnread) return <NotificationLoadingState />;
    if (errorUnread) {
      return <NotificationErrorState onRetry={fetchUnread} />;
    }
    if (unread.length === 0) {
      return (
        <NotificationEmptyState message="No tienes notificaciones nuevas." />
      );
    }
    return unread.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onClick={handleNotificationClick}
        disabled={markingId === notification.id}
      />
    ));
  };

  const renderReadContent = () => {
    if (loadingRead) return <NotificationLoadingState />;
    if (errorRead) {
      return <NotificationErrorState onRetry={fetchRead} />;
    }
    if (read.length === 0) {
      return (
        <NotificationEmptyState message="Aún no tienes notificaciones en tu historial." />
      );
    }
    return read.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onClick={handleNotificationClick}
        disabled={markingId === notification.id}
      />
    ));
  };

  return (
    <Box sx={{ width: "min(380px, calc(100vw - 24px))", maxWidth: "100%" }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "var(--font-size-m)",
            color: "var(--color-fg-default-primary)",
          }}
        >
          Notificaciones
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          px: 1,
          minHeight: 40,
          borderBottom: "1px solid var(--color-border-default-primary)",
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--font-size-s)",
          },
        }}
      >
        <Tab label={`No leídas (${unreadCount})`} />
        <Tab label="Leídas" />
      </Tabs>

      {actionError && (
        <Alert
          severity="error"
          sx={{ mx: 2, mt: 1.5, py: 0 }}
          onClose={() => setActionError(null)}
        >
          {actionError}
        </Alert>
      )}

      <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
        <TabPanel value={tabValue} index={0}>
          {renderUnreadContent()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderReadContent()}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default NotificationTray;
