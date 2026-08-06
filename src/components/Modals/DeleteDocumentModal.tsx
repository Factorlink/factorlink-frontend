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
import DescriptionIcon from "@mui/icons-material/Description";
import { useLegalDocuments } from "../../hooks/useLegalDocuments";

interface DeleteDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  documentData: {
    id: string;
    nombre: string;
  };
}

const DeleteDocumentModal = ({
  open,
  onClose,
  onSuccess,
  documentData,
}: DeleteDocumentModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");

  const { deleteLegalDocument, loading } = useLegalDocuments();

  const handleDelete = async () => {
    try {
      await deleteLegalDocument(documentData.id);

      setAlertStatus("success");
      setAlertMessage("Documento eliminado correctamente.");
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al eliminar el documento"
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
            <DeleteIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Eliminar Documento
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

        {alertStatus !== "success" && (
          <Box
            sx={{
              borderRadius: "var(--radius-m)",
              p: 2,
              mt: 2,
            }}
          >
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
              <Typography
                variant="body1"
                sx={{ color: "text.primary", fontWeight: 500 }}
              >
                {documentData.nombre}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-danger-primary)", lineHeight: 1.6 }}
            >
              ¿Estás seguro de que deseas eliminar este documento? Esta acción
              no se puede deshacer y deberás volver a subir el archivo si lo
              necesitas.
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
            onClick={handleDelete}
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
              "Eliminar Documento"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDocumentModal;
