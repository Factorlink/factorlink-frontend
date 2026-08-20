import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type MouseEvent,
} from "react";
import { Badge, IconButton, Popover } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import useAuthStore from "../../store/authStore";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { getNotificacionContextFromRole } from "../../utils/notificationHelpers";
import NotificationTray from "./NotificationTray";

const NotificationBell: FC = () => {
  const { user, accessToken, currentRole } = useAuthStore();
  const { getUnread } = useNotificaciones();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const open = Boolean(anchorEl);
  const userId = user?.id;
  const context = useMemo(
    () => getNotificacionContextFromRole(currentRole),
    [currentRole],
  );

  const refreshUnreadCount = useCallback(async () => {
    if (!userId || !accessToken || !context) return;

    try {
      const data = await getUnread(userId, context);
      setUnreadCount(data.count ?? data.notifications?.length ?? 0);
    } catch {
      // Keep last known count on background refresh failure
    }
  }, [accessToken, context, getUnread, userId]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="Notificaciones"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
        sx={{
          backgroundColor: "var(--color-bg-accent-primary)",
          color: "var(--color-fg-on-accent-primary)",
          borderRadius: "var(--radius-m)",
          "&:hover": {
            backgroundColor: "var(--color-bg-accent-primary-hover)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          invisible={unreadCount === 0}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "var(--color-bg-danger-primary)",
              color: "var(--color-fg-on-danger-primary)",
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
            },
          }}
        >
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: "var(--radius-m)",
              boxShadow: "var(--shadow-popover)",
              backgroundColor: "var(--color-bg-default-primary)",
              border: "1px solid var(--color-border-default-primary)",
              overflow: "hidden",
            },
          },
        }}
      >
        {userId && context ? (
          <NotificationTray
            userId={userId}
            context={context}
            currentRole={currentRole}
            open={open}
            unreadCount={unreadCount}
            onUnreadCountChange={setUnreadCount}
            onClose={handleClose}
          />
        ) : null}
      </Popover>
    </>
  );
};

export default NotificationBell;
