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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import { useLegalDocuments } from "../../hooks/useLegalDocuments";

interface DownloadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  documentData: {
    id: string;
    nombre: string;
  };
}

const DownloadDocumentModal = ({
  open,
  onClose,
  documentData,
}: DownloadDocumentModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");

  const { getLegalDocumentById, loading } = useLegalDocuments();

  const handleDownload = async () => {
    try {
      const document = await getLegalDocumentById(documentData.id);

      if (document?.base64) {
        // Convert base64 to Blob
        const byteCharacters = atob(document.base64.split(',')[1] || document.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        // Create a download link from Blob
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.urlArchivo.split('/').pop() || 'documento';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setAlertStatus('success');
        setAlertMessage('Documento descargado correctamente.');
      } else {
        throw new Error("No se encontró el archivo");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al descargar el documento"
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
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileDownloadIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Descargar Documento
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
              sx={{ color: "text.secondary", lineHeight: 1.6 }}
            >
              ¿Deseas descargar este documento a tu dispositivo?
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
            onClick={handleDownload}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "primary.main",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Descargar"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDocumentModal;
