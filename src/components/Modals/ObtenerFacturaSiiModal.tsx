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

const MAX_SII_FETCH_ATTEMPTS = 3;

interface ObtenerFacturaSiiModalProps {
  open: boolean;
  status: "loading" | "error";
  onRetry: () => void;
  onCancel: () => void;
  loadingTitle?: string;
  loadingSubtitle?: string;
  errorTitle?: string;
  errorSubtitle?: string;
}

const DEFAULT_LOADING_TITLE =
  "Estamos cargando los datos de tu factura desde el SII";
const DEFAULT_LOADING_SUBTITLE = "Espera un momento, por favor.";
const DEFAULT_ERROR_TITLE = "No pudimos cargar los datos de tu factura";
const DEFAULT_ERROR_SUBTITLE =
  "Hubo un problema al obtener la información desde el SII. Puedes intentarlo nuevamente.";

const ObtenerFacturaSiiModal = ({
  open,
  status,
  onRetry,
  onCancel,
  loadingTitle = DEFAULT_LOADING_TITLE,
  loadingSubtitle = DEFAULT_LOADING_SUBTITLE,
  errorTitle = DEFAULT_ERROR_TITLE,
  errorSubtitle = DEFAULT_ERROR_SUBTITLE,
}: ObtenerFacturaSiiModalProps) => {
  const [attempts, setAttempts] = useState(0);
  const isLoading = status === "loading";
  const attemptsExhausted = attempts >= MAX_SII_FETCH_ATTEMPTS;

  useEffect(() => {
    if (!open) {
      setAttempts(0);
    }
  }, [open]);

  const handleRetry = () => {
    if (attemptsExhausted) return;
    setAttempts((current) => current + 1);
    onRetry();
  };

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
          {isLoading ? loadingTitle : errorTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
          {isLoading
            ? loadingSubtitle
            : attemptsExhausted
              ? "Máximo de intentos alcanzado. No fue posible obtener los datos desde el SII."
              : errorSubtitle}
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
              onClick={handleRetry}
              disabled={attemptsExhausted}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-accent-primary-hover)",
                },
                "&:disabled": {
                  backgroundColor: "var(--color-bg-disabled-primary)",
                  color: "var(--color-fg-on-accent-primary)",
                  opacity: 0.7,
                },
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
          {!attemptsExhausted && attempts > 0 && (
            <Typography
              variant="caption"
              sx={{ color: "var(--color-fg-default-secondary)", pb: 3 }}
            >
              Intento {attempts} de {MAX_SII_FETCH_ATTEMPTS}
            </Typography>
          )}
          {attemptsExhausted && (
            <Typography
              variant="caption"
              sx={{ color: "var(--color-fg-danger-primary)", pb: 3, fontWeight: 600 }}
            >
              Máximo de intentos alcanzado
            </Typography>
          )}
        </>
      )}
    </Dialog>
  );
};

export default ObtenerFacturaSiiModal;
