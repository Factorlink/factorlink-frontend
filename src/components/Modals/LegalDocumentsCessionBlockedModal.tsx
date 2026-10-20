import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface LegalDocumentsCessionBlockedModalProps {
  open: boolean;
  onUnderstood: () => void;
  onViewDocuments: () => void;
}

const LegalDocumentsCessionBlockedModal = ({
  open,
  onUnderstood,
  onViewDocuments,
}: LegalDocumentsCessionBlockedModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onUnderstood}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "var(--radius-l)", maxWidth: 420, p: 1 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-m)",
              backgroundColor: "var(--color-bg-warning-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 36, color: "var(--color-fg-warning-primary)" }}
            />
          </Box>
          <Typography variant="h5" fontWeight={600}>
            Validación de empresa pendiente
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Para ceder facturas en Factorlink, tu empresa debe contar con al menos
          3 documentos legales aprobados.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adjunta los documentos requeridos o espera la aprobación de los que ya
          enviaste.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3, px: 3 }}>
        <Button
          variant="outlined"
          onClick={onUnderstood}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: "var(--radius-m)",
            fontWeight: 600,
          }}
        >
          Entendido
        </Button>
        <Button
          variant="contained"
          onClick={onViewDocuments}
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            px: 3,
            borderRadius: "var(--radius-m)",
            fontWeight: 600,
            color: "white",
          }}
        >
          Ver documentos legales
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LegalDocumentsCessionBlockedModal;
