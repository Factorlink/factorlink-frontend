import { Warning } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface LogoutConfirmDialogProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutConfirmDialog = ({
  open,
  loading = false,
  onCancel,
  onConfirm,
}: LogoutConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-l)",
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
        }}
      >
        <Warning sx={{ color: "var(--color-fg-warning-primary)" }} />
        Confirmar cierre de sesión
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary" }}>
          ¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a
          iniciar sesión para acceder al sistema.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? "Cerrando..." : "Cerrar sesión"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmDialog;
