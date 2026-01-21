import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface SessionExpiringModalProps {
  open: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
  countdownSeconds?: number;
}

const SessionExpiringModal = ({
  open,
  onExtendSession,
  onLogout,
  countdownSeconds = 120, // 2 minutes default
}: SessionExpiringModalProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState(countdownSeconds);

  useEffect(() => {
    if (!open) {
      setSecondsRemaining(countdownSeconds);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdownSeconds, onLogout]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (secondsRemaining / countdownSeconds) * 100;

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          return;
        }
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <WarningAmberIcon
          sx={{ fontSize: 48, color: "warning.main", mb: 1 }}
        />
        <Typography variant="h6" component="div">
          Sesión por expirar
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "text.secondary", mb: 3 }}
        >
          Tu sesión está por expirar debido a inactividad. ¿Deseas continuar?
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={4}
              sx={{
                color: secondsRemaining <= 30 ? "error.main" : "warning.main",
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: secondsRemaining <= 30 ? "error.main" : "text.primary",
                  fontWeight: "bold",
                }}
              >
                {formatTime(secondsRemaining)}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Tiempo restante
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onLogout}>
          Cerrar sesión
        </Button>
        <Button variant="contained" color="primary" onClick={onExtendSession}>
          Continuar sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiringModal;
