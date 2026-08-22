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

interface ConfirmarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  ofertaCondicionada?: boolean;
}

const ConfirmarOfertaModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  ofertaCondicionada = false,
}: ConfirmarOfertaModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-l)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          ¿Confirmar envío de oferta?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 2,
            mt: 0.5,
            borderRadius: "var(--radius-m)",
            backgroundColor: "var(--color-bg-warning-secondary)",
          }}
        >
          <Warning
            sx={{ color: "var(--color-fg-warning-primary)", fontSize: 20, mt: 0.25 }}
          />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-warning-primary)", fontWeight: 500 }}
          >
            {ofertaCondicionada
              ? "Enviarás una oferta condicionada: la empresa no podrá aceptarla hasta que envíes la oferta final."
              : "Una vez enviada, no podrás modificar ni reenviar esta oferta."}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 2, justifyContent: "center" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: "var(--radius-m)",
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
            borderRadius: "var(--radius-m)",
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
