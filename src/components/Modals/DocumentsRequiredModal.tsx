import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

interface DocumentsRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

const DocumentsRequiredModal = ({ open, onClose }: DocumentsRequiredModalProps) => {
  const navigate = useNavigate();

  const handleGoToDocuments = () => {
    onClose();
    navigate("/edit/documentos-legales");
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
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
          <DescriptionIcon sx={{ fontSize: 64, color: "var(--color-fg-accent-primary)" }} />
          <Typography variant="h5" fontWeight={600}>
            Documentos requeridos
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Para enviar facturas a cotizar, necesitas subir todos los documentos
          legales requeridos. Una vez que tus documentos estén completos y
          validados, esta opción estará habilitada.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: "var(--radius-m)",
          }}
        >
          Más tarde
        </Button>
        <Button
          variant="contained"
          onClick={handleGoToDocuments}
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            px: 3,
            borderRadius: "var(--radius-m)",
            color: "white",
          }}
        >
          Subir documentos
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentsRequiredModal;
