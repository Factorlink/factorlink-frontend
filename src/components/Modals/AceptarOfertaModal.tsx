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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import TextField from "@mui/material/TextField";
import { useOfertas } from "../../hooks/useOfertas";

interface AceptarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ofertaData: {
    id: string;
    factoringName: string;
    montoAdelanto: string;
    tasa: string;
    porcentajeFinanciamiento: string;
  };
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const AceptarOfertaModal = ({
  open,
  onClose,
  onSuccess,
  ofertaData,
}: AceptarOfertaModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [comentario, setComentario] = useState("");
  const { responderOferta, loading } = useOfertas();

  const handleAccept = async () => {
    try {
      await responderOferta(ofertaData.id, "aceptada", comentario);
      setAlertStatus("success");
      setAlertMessage("Oferta aceptada correctamente.");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al aceptar la oferta"
      );
    }
  };

  const handleClose = () => {
    if (alertStatus === "success") {
      onSuccess?.();
    }
    setAlertStatus(null);
    setAlertMessage("");
    setComentario("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
              backgroundColor: "var(--color-bg-success-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            ¿Aceptar oferta?
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
                <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
                  {ofertaData.factoringName}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Adelanto: {formatCurrency(ofertaData.montoAdelanto)} • Tasa: {parseFloat(ofertaData.tasa || "0").toFixed(2)}%
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: "var(--color-fg-success-primary)", lineHeight: 1.6 }}>
              Al aceptar esta oferta, se notificará al factoring y se procederá
              con el financiamiento. Esta acción no se puede deshacer.
            </Typography>

            <TextField
              label="Comentario (opcional)"
              multiline
              minRows={3}
              maxRows={5}
              fullWidth
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              disabled={loading}
              placeholder="Escribe un comentario para el factoring..."
              sx={{ mt: 2 }}
              inputProps={{ maxLength: 500 }}
            />
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
          {alertStatus === "success" ? "Cerrar" : "Cancelar"}
        </Button>
        {alertStatus !== "success" && (
          <Button
            variant="contained"
            onClick={handleAccept}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "var(--color-bg-success-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-success-primary-hover)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Aceptar oferta"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AceptarOfertaModal;
