import type { FC } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ErrorOutline, NotificationsNone } from "@mui/icons-material";

interface NotificationLoadingStateProps {
  compact?: boolean;
}

export const NotificationLoadingState: FC<NotificationLoadingStateProps> = ({
  compact = false,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: compact ? 4 : 6,
    }}
  >
    <CircularProgress
      size={28}
      sx={{ color: "var(--color-fg-accent-primary)" }}
    />
  </Box>
);

interface NotificationEmptyStateProps {
  message: string;
}

export const NotificationEmptyState: FC<NotificationEmptyStateProps> = ({
  message,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      py: 5,
      px: 3,
      textAlign: "center",
    }}
  >
    <NotificationsNone
      sx={{ fontSize: 40, color: "var(--color-fg-default-tertiary)" }}
    />
    <Typography
      variant="body2"
      sx={{ color: "var(--color-fg-default-secondary)" }}
    >
      {message}
    </Typography>
  </Box>
);

interface NotificationErrorStateProps {
  onRetry: () => void;
}

export const NotificationErrorState: FC<NotificationErrorStateProps> = ({
  onRetry,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5,
      py: 4,
      px: 3,
      textAlign: "center",
    }}
  >
    <ErrorOutline
      sx={{ fontSize: 40, color: "var(--color-fg-danger-primary)" }}
    />
    <Typography
      variant="body2"
      sx={{ color: "var(--color-fg-default-secondary)" }}
    >
      No pudimos cargar tus notificaciones. Intenta nuevamente.
    </Typography>
    <Button
      variant="contained"
      size="small"
      onClick={onRetry}
      sx={{
        mt: 0.5,
        textTransform: "none",
        backgroundColor: "var(--color-bg-accent-primary)",
        color: "var(--color-fg-on-accent-primary)",
        "&:hover": {
          backgroundColor: "var(--color-bg-accent-primary-hover)",
        },
      }}
    >
      Reintentar
    </Button>
  </Box>
);
