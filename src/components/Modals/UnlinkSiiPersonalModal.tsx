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
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { useEmpresa } from "../../hooks/useEmpresa";
import useAuthStore from "../../store/authStore";
import type { Role } from "../../types/role";

interface UnlinkSiiPersonalModalProps {
  open: boolean;
  onClose: () => void;
}

const UnlinkSiiPersonalModal = ({
  open,
  onClose,
}: UnlinkSiiPersonalModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const { currentRole } = useAuthStore();
  const { unsyncPersonalDataSii, loading } = useEmpresa();

  const handleUnlink = async () => {
    try {
      const empresaId = currentRole?.empresaId || "";
      const response = await unsyncPersonalDataSii(empresaId);

      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        empresa: response,
      } as Role);

      setAlertStatus("success");
      setAlertMessage("La cuenta personal del SII ha sido desvinculada correctamente.");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al desvincular la cuenta personal del SII"
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
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
            <LinkOffIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Desvincular cuenta personal SII
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert
            severity={alertStatus}
            sx={{ mb: 3 }}
            onClose={() => {
              setAlertStatus(null);
              setAlertMessage("");
              handleClose();
            }}
          >
            {alertMessage}
          </Alert>
        )}

        {alertStatus !== "success" && (
          <Box sx={{ borderRadius: "var(--radius-m)", p: 2, mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-danger-primary)", lineHeight: 1.6 }}
            >
              Al desvincular tu cuenta personal del SII perderás acceso a las
              funcionalidades avanzadas como la cesión electrónica de facturas,
              obtención automática de XML/DTE y consulta de estado de cesión.{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                ¿Deseas continuar?
              </Typography>
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
          {alertStatus === "success" ? "Cerrar" : "Cancelar"}
        </Button>
        {alertStatus !== "success" && (
          <Button
            variant="contained"
            onClick={handleUnlink}
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
              "Desvincular"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UnlinkSiiPersonalModal;
