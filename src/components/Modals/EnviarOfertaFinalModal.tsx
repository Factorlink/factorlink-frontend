import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import WarningIcon from "@mui/icons-material/Warning";
import { useOfertas } from "../../hooks/useOfertas";
import type { Oferta } from "../../types/oferta";
import { formatMoney, formatPercent } from "../../utils/ofertaFormatters";

interface EnviarOfertaFinalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  oferta: Oferta;
}

const EnviarOfertaFinalModal = ({
  open,
  onClose,
  onSuccess,
  oferta,
}: EnviarOfertaFinalModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");
  const { updateOferta, loading } = useOfertas();

  const handleEnviar = async () => {
    try {
      await updateOferta(oferta.id, { ofertaCondicionada: false });
      setAlertStatus("success");
      setAlertMessage("Oferta final enviada. Esperando respuesta de la Empresa.");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al enviar la oferta final"
      );
    }
  };

  const handleClose = () => {
    if (alertStatus === "success") {
      onSuccess?.();
    }
    setAlertStatus(null);
    setAlertMessage("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-l)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-m)",
              backgroundColor: "var(--color-bg-accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SendIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            ¿Enviar oferta final?
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert severity={alertStatus} sx={{ mb: 3 }}>
            {alertMessage}
          </Alert>
        )}

        {alertStatus !== "success" && (
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)", mb: 2 }}
            >
              Al enviar la oferta final, la Empresa podrá aceptarla o
              rechazarla. Las condiciones vigentes son un adelanto de{" "}
              {formatMoney(oferta.montoAdelanto)} con una tasa de{" "}
              {formatPercent(oferta.tasa)}.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                borderRadius: "var(--radius-m)",
                backgroundColor: "var(--color-bg-warning-secondary)",
              }}
            >
              <WarningIcon
                sx={{
                  color: "var(--color-fg-warning-primary)",
                  fontSize: 20,
                  mt: 0.25,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "var(--color-fg-warning-primary)",
                  fontWeight: 500,
                }}
              >
                La oferta dejará de estar condicionada y no podrás volver a
                marcarla como condicionada. La conversación seguirá visible como
                historial.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: "var(--radius-m)",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {alertStatus === "success" ? "Cerrar" : "Volver"}
        </Button>
        {alertStatus !== "success" && (
          <Button
            variant="contained"
            onClick={handleEnviar}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Enviar oferta final"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EnviarOfertaFinalModal;
