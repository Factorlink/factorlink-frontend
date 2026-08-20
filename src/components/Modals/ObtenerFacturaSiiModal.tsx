import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const AUTO_RETRY_SECONDS = 5;

interface ObtenerFacturaSiiModalProps {
  open: boolean;
  status: "loading" | "error";
  onRetry: () => void;
  onCancel: () => void;
}

const ObtenerFacturaSiiModal = ({
  open,
  status,
  onRetry,
  onCancel,
}: ObtenerFacturaSiiModalProps) => {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RETRY_SECONDS);
  const isLoading = status === "loading";

  useEffect(() => {
    if (!open || status !== "error") {
      setSecondsLeft(AUTO_RETRY_SECONDS);
      return;
    }

    setSecondsLeft(AUTO_RETRY_SECONDS);
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    const timeout = window.setTimeout(() => {
      onRetry();
    }, AUTO_RETRY_SECONDS * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [open, status, onRetry]);

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (isLoading) return;
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onCancel();
      }}
      disableEscapeKeyDown
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-l)",
          maxWidth: 420,
          width: "100%",
          p: 1,
          textAlign: "center",
        },
      }}
    >
      {!isLoading && (
        <IconButton
          onClick={onCancel}
          aria-label="Cerrar"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <DialogContent sx={{ px: 4, pt: 5, pb: 2 }}>
        {isLoading ? (
          <Box
            sx={{
              width: 88,
              height: 88,
              mx: "auto",
              mb: 3,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DescriptionIcon
              sx={{ fontSize: 56, color: "var(--color-fg-accent-primary)" }}
            />
            <CircularProgress
              size={88}
              thickness={2.4}
              sx={{
                position: "absolute",
                color: "var(--color-fg-accent-primary)",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 88,
              height: 88,
              mx: "auto",
              mb: 3,
              borderRadius: "50%",
              backgroundColor: "var(--color-bg-danger-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 48, color: "var(--color-fg-danger-primary)" }}
            />
          </Box>
        )}

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "var(--color-fg-default-primary)",
            mb: 1,
          }}
        >
          {isLoading
            ? "Estamos cargando los datos de tu factura desde el SII"
            : "No pudimos cargar los datos de tu factura"}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
          {isLoading
            ? "Espera un momento, por favor."
            : "Hubo un problema al obtener la información desde el SII. Vamos a intentar nuevamente."}
        </Typography>

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mt: 3,
              "@keyframes siiDot": {
                "0%, 80%, 100%": { opacity: 0.3, transform: "translateY(0)" },
                "40%": { opacity: 1, transform: "translateY(-3px)" },
              },
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-fg-accent-primary)",
                  animation: "siiDot 1.2s ease-in-out infinite",
                  animationDelay: `${index * 0.16}s`,
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>

      {!isLoading && (
        <>
          <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                color: "var(--color-fg-on-accent-primary)",
              }}
            >
              Reintentar
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderColor: "var(--color-border-default-primary)",
                color: "var(--color-fg-default-primary)",
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
          <Typography
            variant="caption"
            sx={{ color: "var(--color-fg-default-secondary)", pb: 3 }}
          >
            Intentaremos automáticamente en {secondsLeft} segundos...
          </Typography>
        </>
      )}
    </Dialog>
  );
};

export default ObtenerFacturaSiiModal;
