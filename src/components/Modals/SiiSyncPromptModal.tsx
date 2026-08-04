import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import useAuthStore from "../../store/authStore";
import siiLogo from "../../assets/png/sii-logo.png";

const SiiSyncPromptModal = () => {
  const [open, setOpen] = useState(false);
  const { currentRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // No mostrar si ya está en la página de empresa
    if (location.pathname === "/edit/empresa") return;

    // Mostrar solo si el contexto es "empresa" y empresaId es null
    if (
      currentRole &&
      currentRole.contexto === "empresa" &&
      !currentRole.empresaId
    ) {
      setOpen(true);
    }
  }, [currentRole, location.pathname]);

  const handleSync = () => {
    setOpen(false);
    navigate("/edit/empresa");

    // Esperar a que la navegación complete y hacer scroll
    setTimeout(() => {
      const siiSyncCard = document.getElementById("sii-sync-card");
      if (siiSyncCard) {
        siiSyncCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  };

  const handleDismiss = () => {
    setOpen(false);
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
          <Box
            component="img"
            src={siiLogo}
            alt="Logo SII"
            sx={{ width: 80, height: "auto" }}
          />
          <Typography variant="h5" fontWeight={600}>
            Sincroniza tu empresa
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Para comenzar a operar, necesitas sincronizar los datos de tu empresa
          con el Servicio de Impuestos Internos (SII). Este proceso es rápido y
          solo necesitas tus credenciales del SII.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleDismiss}
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
          onClick={handleSync}
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            px: 3,
            borderRadius: "var(--radius-m)",
            color: "white",
          }}
        >
          Sincronizar ahora
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SiiSyncPromptModal;
