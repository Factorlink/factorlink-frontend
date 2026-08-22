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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { useOfertas } from "../../hooks/useOfertas";
import type { Oferta } from "../../types/oferta";
import { formatMoney, formatPercent } from "../../utils/ofertaFormatters";

interface CancelarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  oferta: Oferta;
}

const CancelarOfertaModal = ({
  open,
  onClose,
  onSuccess,
  oferta,
}: CancelarOfertaModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");
  const { deleteOferta, loading } = useOfertas();

  const handleCancelar = async () => {
    try {
      await deleteOferta(oferta.id);
      setAlertStatus("success");
      setAlertMessage("Oferta cancelada correctamente.");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al cancelar la oferta"
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
              backgroundColor: "var(--color-bg-danger-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteOutlineIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            ¿Cancelar oferta?
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
          <Box sx={{ borderRadius: "var(--radius-m)", p: 2, mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 2,
                borderRadius: "var(--radius-m)",
                backgroundColor: "var(--color-bg-default-tertiary)",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-m)",
                  bgcolor: "var(--color-bg-accent-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon sx={{ color: "primary.main" }} />
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  Tu oferta
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {`Adelanto: ${formatMoney(oferta.montoAdelanto)} • Tasa: ${formatPercent(oferta.tasa)}`}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "var(--color-fg-danger-primary)",
                lineHeight: 1.6,
              }}
            >
              Esta acción no se puede deshacer. La oferta se eliminará junto con
              su conversación y la empresa dejará de verla. Si quieres volver a
              participar, tendrás que enviar una oferta nueva.
            </Typography>
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
            onClick={handleCancelar}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "var(--color-bg-danger-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-danger-primary-hover)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cancelar oferta"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CancelarOfertaModal;
