import { useEffect } from "react";
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

interface CederFacturaProgressModalProps {
  open: boolean;
  status: "loading" | "error";
  errorMessage?: string;
  onRetry: () => void;
  onCancel: () => void;
}

const LOADING_TITLE = "Estamos cediendo tu factura";
const LOADING_SUBTITLE = "Espera un momento, por favor.";
const LOADING_WARNING =
  "No cierres ni recargues la página para evitar la pérdida de información.";
const ERROR_TITLE = "No pudimos ceder la factura";
const DEFAULT_ERROR_MESSAGE = "Ocurrió un error al aceptar la oferta";

const CederFacturaProgressModal = ({
  open,
  status,
  errorMessage,
  onRetry,
  onCancel,
}: CederFacturaProgressModalProps) => {
  const isLoading = status === "loading";

  useEffect(() => {
    if (!open || !isLoading) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [open, isLoading]);

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
          {isLoading ? LOADING_TITLE : ERROR_TITLE}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
          {isLoading ? LOADING_SUBTITLE : errorMessage || DEFAULT_ERROR_MESSAGE}
        </Typography>

        {isLoading && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 3,
                "@keyframes cederDot": {
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
                    animation: "cederDot 1.2s ease-in-out infinite",
                    animationDelay: `${index * 0.16}s`,
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 3,
                color: "var(--color-fg-default-secondary)",
              }}
            >
              {LOADING_WARNING}
            </Typography>
          </>
        )}
      </DialogContent>

      {!isLoading && (
        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 3 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              backgroundColor: "var(--color-bg-accent-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-accent-primary-hover)",
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
      )}
    </Dialog>
  );
};

export default CederFacturaProgressModal;
