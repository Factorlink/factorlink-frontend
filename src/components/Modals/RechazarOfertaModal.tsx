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
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";
import TextField from "@mui/material/TextField";
import { useOfertas } from "../../hooks/useOfertas";
import {
  formatMoney,
  formatPercent,
  isInformed,
  type OptionalValue,
} from "../../utils/ofertaFormatters";
import { normalizeOfertaEstado, OFERTA_ESTADOS } from "../../utils/ofertaEstados";

interface RechazarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ofertaData: {
    id: string;
    factoringName: string;
    montoAdelanto: string;
    tasa: string;
    porcentajeFinanciamiento: string;
    montoAGirar?: OptionalValue;
    retencion?: OptionalValue;
    ofertaCondicionada?: boolean;
  };
}

const buildResumenLine = (ofertaData: RechazarOfertaModalProps["ofertaData"]) => {
  const parts = [
    `Adelanto: ${formatMoney(ofertaData.montoAdelanto)}`,
    `Tasa: ${formatPercent(ofertaData.tasa)}`,
  ];
  if (isInformed(ofertaData.montoAGirar)) {
    parts.push(`Monto a girar: ${formatMoney(ofertaData.montoAGirar)}`);
  }
  if (isInformed(ofertaData.retencion)) {
    parts.push(`Retención: ${formatMoney(ofertaData.retencion)}`);
  }
  return parts.join(" • ");
};

const RechazarOfertaModal = ({
  open,
  onClose,
  onSuccess,
  ofertaData,
}: RechazarOfertaModalProps) => {
  const [alertStatus, setAlertStatus] = useState<
    "success" | "warning" | "error" | null
  >(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [comentario, setComentario] = useState("");
  const { responderOferta, loading } = useOfertas();
  const condicionada = ofertaData.ofertaCondicionada === true;
  const comentarioRequerido = condicionada && !comentario.trim();

  const handleReject = async () => {
    try {
      const oferta = await responderOferta(ofertaData.id, {
        estado: "rechazada",
        comentarioEmpresa: comentario,
      });
      if (normalizeOfertaEstado(oferta?.estado) === OFERTA_ESTADOS.RECHAZADA) {
        setAlertStatus("success");
        setAlertMessage("Oferta rechazada correctamente.");
      } else {
        setAlertStatus("warning");
        setAlertMessage(
          "Se registró tu comentario en la conversación, pero la oferta sigue condicionada y no fue rechazada. El factoring debe enviar la oferta final para poder responderla."
        );
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al rechazar la oferta"
      );
    }
  };

  const handleClose = () => {
    if (alertStatus === "success" || alertStatus === "warning") {
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
              backgroundColor: "var(--color-bg-danger-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CancelIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            ¿Rechazar oferta?
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

        {alertStatus !== "success" && alertStatus !== "warning" && (
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
                  {buildResumenLine(ofertaData)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: "var(--color-fg-danger-primary)", lineHeight: 1.6 }}>
              ¿Estás seguro de que deseas rechazar esta oferta? Esta acción
              no se puede deshacer y el factoring será notificado.
            </Typography>

            <TextField
              label={condicionada ? "Comentario" : "Comentario (opcional)"}
              multiline
              minRows={3}
              maxRows={5}
              fullWidth
              required={condicionada}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              disabled={loading}
              placeholder="Escribe un comentario para el factoring..."
              helperText={
                condicionada
                  ? "Las ofertas condicionadas exigen un comentario para responder."
                  : undefined
              }
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
          {alertStatus === "success" || alertStatus === "warning"
            ? "Cerrar"
            : "Cancelar"}
        </Button>
        {alertStatus !== "success" && alertStatus !== "warning" && (
          <Button
            variant="contained"
            onClick={handleReject}
            disabled={loading || comentarioRequerido}
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
              "Rechazar oferta"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RechazarOfertaModal;
