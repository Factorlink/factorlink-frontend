import type { FC } from "react";
import { Box, Chip, Typography } from "@mui/material";
import type { Notificacion } from "../../types/notificacion";
import {
  formatNotificationDate,
  getNotificationIcon,
  getNotificationTipoLabel,
} from "../../utils/notificationHelpers";

interface NotificationItemProps {
  notification: Notificacion;
  onClick: (notification: Notificacion) => void;
  disabled?: boolean;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onClick,
  disabled = false,
}) => {
  const Icon = getNotificationIcon(notification.tipo);
  const isUnread = !notification.leida;

  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={() => onClick(notification)}
      sx={{
        display: "flex",
        gap: 1.5,
        width: "100%",
        textAlign: "left",
        border: "none",
        borderBottom: "1px solid var(--color-border-default-primary)",
        cursor: disabled ? "wait" : "pointer",
        px: 2,
        py: 1.5,
        backgroundColor: isUnread
          ? "var(--color-bg-accent-tertiary)"
          : "transparent",
        opacity: disabled ? 0.7 : 1,
        transition: "background-color var(--duration-fast) var(--easing-ease)",
        "&:hover": {
          backgroundColor: isUnread
            ? "var(--color-bg-accent-secondary)"
            : "var(--color-bg-default-primary-hover)",
        },
        "&:last-of-type": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: "var(--radius-m)",
          backgroundColor: isUnread
            ? "var(--color-bg-accent-secondary)"
            : "var(--color-bg-default-secondary)",
          color: isUnread
            ? "var(--color-fg-accent-primary)"
            : "var(--color-fg-default-secondary)",
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
            mb: 0.25,
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: isUnread ? 600 : 500,
              fontSize: "var(--font-size-s)",
              color: isUnread
                ? "var(--color-fg-default-primary)"
                : "var(--color-fg-default-secondary)",
              lineHeight: 1.3,
            }}
          >
            {notification.titulo}
          </Typography>
          {isUnread && (
            <Box
              sx={{
                width: 8,
                height: 8,
                mt: 0.75,
                flexShrink: 0,
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-bg-danger-primary)",
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "var(--color-fg-default-secondary)",
            fontSize: "var(--font-size-xs)",
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notification.mensaje}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={getNotificationTipoLabel(notification.tipo)}
            size="small"
            sx={{
              height: 22,
              fontSize: "var(--font-size-xs)",
              fontFamily: "var(--font-heading)",
              backgroundColor: "var(--color-bg-default-secondary)",
              color: "var(--color-fg-default-secondary)",
            }}
          />
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "var(--color-fg-default-tertiary)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {formatNotificationDate(notification.createdAt)}
            </Typography>
            {notification.leida && notification.readAt && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "var(--color-fg-default-tertiary)",
                  fontSize: "var(--font-size-xs)",
                }}
              >
                Leída {formatNotificationDate(notification.readAt)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationItem;
