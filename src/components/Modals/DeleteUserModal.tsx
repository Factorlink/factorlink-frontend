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
import DeleteIcon from "@mui/icons-material/Delete";
import { useRole } from "../../hooks/useRole";
import useAuthStore from "../../store/authStore";
import { ROLES } from "../../utils/consts";

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userData: {
    email: string;
    fullName: string;
  };
}

const DeleteUserModal = ({
  open,
  onClose,
  onSuccess,
  userData,
}: DeleteUserModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const { currentRole } = useAuthStore();
  const { unassignToEmpresa, unassignToFactoring, loading } = useRole();

  const isEmpresa = currentRole?.contexto === "empresa";

  const handleDelete = async () => {
    try {
      if (isEmpresa) {
        await unassignToEmpresa({
          email: userData.email,
          role: ROLES.EMPRESA_USUARIO,
          empresaId: currentRole?.empresaId || "",
        });
      } else {
        await unassignToFactoring({
          email: userData.email,
          role: ROLES.FACTORING_ANALISTA,
          factoringId: currentRole?.factoringId || "",
        });
      }

      setAlertStatus("success");
      setAlertMessage("Usuario eliminado correctamente.");
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al eliminar el usuario"
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
          borderRadius: 3,
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
              borderRadius: 2,
              backgroundColor: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Eliminar Usuario
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
            }}
          >
            {alertMessage}
          </Alert>
        )}

        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            mt: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#EF4444", lineHeight: 1.6 }}
          >
            Esta acción eliminará a{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              {userData.fullName}
            </Typography>{" "}
            ({userData.email}) de la organización. Esta acción no se puede
            deshacer.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading || alertStatus === "success"}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "white",
            backgroundColor: "#EF4444",
            "&:hover": {
              backgroundColor: "#DC2626",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Eliminar Usuario"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
