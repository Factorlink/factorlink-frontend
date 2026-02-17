import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

const formatCurrency = (value: number) => {
  if (isNaN(value)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(value);
};

interface ConfirmarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: {
    porcentajeFinanciamiento: number;
    montoAdelanto: number;
    tasa: number;
    plazo: number;
  };
}

const ConfirmarOfertaModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  data,
}: ConfirmarOfertaModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          ¿Confirmar envío de oferta?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Estás por enviar la siguiente oferta:
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        {/* Summary */}
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderRadius: 2,
            p: 2.5,
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Financiamiento:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {data.porcentajeFinanciamiento}%
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Monto adelanto:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
              {formatCurrency(data.montoAdelanto)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Tasa:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {data.tasa}%
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Plazo:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {data.plazo} días
            </Typography>
          </Box>
        </Box>

        {/* Warning */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2.5 }}>
          <Warning sx={{ color: "#F59E0B", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "#F59E0B", fontWeight: 500 }}>
            Una vez enviada, no podrás modificar ni reenviar esta oferta.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 2, justifyContent: "center" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "white",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirmar envío"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmarOfertaModal;
