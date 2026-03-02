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
import siiLogo from "../../assets/png/sii-logo.png";

interface SiiPersonalSyncPromptModalProps {
  open: boolean;
  onClose: () => void;
}

const SiiPersonalSyncPromptModal = ({
  open,
  onClose,
}: SiiPersonalSyncPromptModalProps) => {
  const navigate = useNavigate();

  const handleSync = () => {
    onClose();
    navigate("/edit/empresa");

    setTimeout(() => {
      const siiPersonalCard = document.getElementById("sii-personal-sync-card");
      if (siiPersonalCard) {
        siiPersonalCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, maxWidth: 420, p: 1 },
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
            component="img"
            src={siiLogo}
            alt="Logo SII"
            sx={{ width: 80, height: "auto" }}
          />
          <Typography variant="h5" fontWeight={600}>
            Vincula tu cuenta personal SII
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Para obtener automáticamente los documentos XML y PDF desde el SII,
          necesitas vincular tu cuenta personal del Servicio de Impuestos
          Internos. Este proceso es rápido y solo necesitas tus credenciales
          personales del SII.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            borderRadius: 2,
          }}
        >
          Más tarde
        </Button>
        <Button
          variant="contained"
          onClick={handleSync}
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            px: 3,
            borderRadius: 2,
            color: "white",
          }}
        >
          Vincular ahora
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SiiPersonalSyncPromptModal;
