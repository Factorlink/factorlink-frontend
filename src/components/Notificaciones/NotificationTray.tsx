import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Tab, Tabs, Typography } from "@mui/material";
import type { Notificacion, NotificacionContext } from "../../types/notificacion";
import type { Role } from "../../types/role";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { useOfertas } from "../../hooks/useOfertas";
import { useFacturas } from "../../hooks/useFacturas";
import { useFacturaGrupos } from "../../hooks/useFacturaGrupos";
import {
  groupNotificationsForTray,
  getNotificationRoute,
  isFacturaGrupoNotification,
  isOfertaNotification,
  pickFacturaForGrupoOfertaNotification,
  sortReadNotifications,
  sortUnreadNotifications,
  type NotificationTrayGroup,
} from "../../utils/notificationHelpers";
import NotificationGroup from "./NotificationGroup";
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
  context: NotificacionContext;
  currentRole: Role | null;
  open: boolean;
  unreadCount: number;
  onUnreadCountChange: (count: number) => void;
  onClose: () => void;
}

const defaultExpandedKeys = (
  groups: NotificationTrayGroup[],
  expandUnreadGroups: boolean,
): Set<string> => {
  const keys = new Set<string>();
  if (!expandUnreadGroups) return keys;
  for (const group of groups) {
    if (group.notifications.length > 1 && group.unreadCount > 0) {
      keys.add(group.key);
    }
  }
  return keys;
};

const NotificationTray: FC<NotificationTrayProps> = ({
  userId,
  context,
  currentRole,
  open,
  unreadCount,
  onUnreadCountChange,
  onClose,
}) => {
  const navigate = useNavigate();
  const { getUnread, getRead, markAsRead } = useNotificaciones();
  const { getOfertaById, getOfertasByFacturaId } = useOfertas();
  const { getFacturaById, getFacturaByIdAndFactoringId } = useFacturas();
  const { getFacturaGrupoFacturas, getFacturaGrupoFacturasFactoring } =
    useFacturaGrupos();

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
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const unreadGroups = useMemo(
    () => groupNotificationsForTray(unread),
    [unread],
  );
  const readGroups = useMemo(() => groupNotificationsForTray(read), [read]);

  const fetchUnread = useCallback(async () => {
    try {
      setLoadingUnread(true);
      setErrorUnread(false);
      const data = await getUnread(userId, context);
      const sorted = sortUnreadNotifications(data.notifications ?? []);
      setUnread(sorted);
      onUnreadCountChange(data.count ?? sorted.length);
      setExpandedKeys(
        defaultExpandedKeys(groupNotificationsForTray(sorted), true),
      );
    } catch {
      setErrorUnread(true);
    } finally {
      setLoadingUnread(false);
    }
  }, [context, getUnread, onUnreadCountChange, userId]);

  const fetchRead = useCallback(async () => {
    try {
      setLoadingRead(true);
      setErrorRead(false);
      const data = await getRead(userId, context);
      const sorted = sortReadNotifications(data.notifications ?? []);
      setRead(sorted);
      setHasLoadedRead(true);
      // Leídas: grupos colapsados por defecto.
      setExpandedKeys(new Set());
    } catch {
      setErrorRead(true);
    } finally {
      setLoadingRead(false);
    }
  }, [context, getRead, userId]);

  useEffect(() => {
    if (!open) return;
    setActionError(null);
    setHasLoadedRead(false);
    fetchUnread();
  }, [open, fetchUnread]);

  useEffect(() => {
    if (!open || tabValue !== 1 || hasLoadedRead) return;
    fetchRead();
  }, [open, tabValue, hasLoadedRead, fetchRead]);

  const handleTabChange = (_: SyntheticEvent, nextValue: number) => {
    setTabValue(nextValue);
    setActionError(null);
    if (nextValue === 0) {
      setExpandedKeys(defaultExpandedKeys(unreadGroups, true));
    } else if (hasLoadedRead) {
      setExpandedKeys(new Set());
    }
  };

  const toggleGroup = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleNotificationClick = async (notification: Notificacion) => {
    setActionError(null);
    setMarkingId(notification.id);

    try {
      const isGrupoOferta =
        isOfertaNotification(notification.tipo) &&
        isFacturaGrupoNotification(notification);
      const shouldFetchOferta =
        isOfertaNotification(notification.tipo) &&
        !isFacturaGrupoNotification(notification) &&
        Boolean(notification.entidadId);
      const ofertaPromise = shouldFetchOferta
        ? getOfertaById(notification.entidadId).catch(() => null)
        : Promise.resolve(null);
      const readPromise = !notification.leida
        ? markAsRead(notification.id, userId, context)
        : Promise.resolve();

      const [oferta] = await Promise.all([ofertaPromise, readPromise]);
      if (!notification.leida) {
        setUnread((prev) => prev.filter((item) => item.id !== notification.id));
        onUnreadCountChange(Math.max(0, unreadCount - 1));
        setHasLoadedRead(false);
      }

      let facturaId: string | null = oferta?.facturaId ?? null;
      let facturaGrupoId: string | null = null;
      let ofertaId: string | null =
        oferta?.id ??
        (isFacturaGrupoNotification(notification)
          ? null
          : notification.entidadId || null);

      if (oferta?.facturaId) {
        try {
          const factura =
            currentRole?.contexto === "factoring" && currentRole.factoringId
              ? await getFacturaByIdAndFactoringId(
                  oferta.facturaId,
                  currentRole.factoringId,
                )
              : await getFacturaById(oferta.facturaId);
          facturaGrupoId = factura?.facturaGrupoId ?? null;
        } catch {
          facturaGrupoId = null;
        }
      } else if (isGrupoOferta && notification.entidadId) {
        // entidad=factura_grupo: resolver una factura del grupo para abrir el drawer.
        facturaGrupoId = notification.entidadId;
        try {
          const facturas =
            currentRole?.contexto === "factoring" && currentRole.factoringId
              ? await getFacturaGrupoFacturasFactoring(
                  notification.entidadId,
                  currentRole.factoringId,
                )
              : await getFacturaGrupoFacturas(notification.entidadId);
          const candidate = pickFacturaForGrupoOfertaNotification(facturas);
          if (candidate) {
            facturaId = candidate.id;
            try {
              const data = await getOfertasByFacturaId(candidate.id);
              const list = Array.isArray(data) ? data : data?.data || [];
              ofertaId = list[0]?.id ?? null;
            } catch {
              ofertaId = null;
            }
          }
        } catch {
          facturaId = null;
          ofertaId = null;
        }
      }

      const route = getNotificationRoute(notification, currentRole, {
        facturaId,
        facturaGrupoId,
        ofertaId,
      });
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

  const renderGroups = (groups: NotificationTrayGroup[]) =>
    groups.map((group) => {
      if (group.notifications.length === 1) {
        const notification = group.notifications[0];
        return (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
            disabled={markingId === notification.id}
          />
        );
      }

      return (
        <NotificationGroup
          key={group.key}
          label={group.label}
          count={group.notifications.length}
          unreadCount={group.unreadCount}
          expanded={expandedKeys.has(group.key)}
          onToggle={() => toggleGroup(group.key)}
        >
          {group.notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              disabled={markingId === notification.id}
            />
          ))}
        </NotificationGroup>
      );
    });

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
    return renderGroups(unreadGroups);
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
    return renderGroups(readGroups);
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
