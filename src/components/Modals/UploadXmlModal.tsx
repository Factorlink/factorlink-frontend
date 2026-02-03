import { useState, useRef } from "react";
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
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFacturas } from "../../hooks/useFacturas";

interface UploadXmlModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  facturaId: string;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateXmlFile = (file: File): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`El archivo excede el tamaño máximo de ${formatFileSize(MAX_FILE_SIZE)}`);
  }

  // Validar extensión
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
  if (extension !== ".xml") {
    errors.push("Solo se permiten archivos XML");
  }

  // Validar tipo MIME
  if (file.type !== "text/xml" && file.type !== "application/xml" && file.type !== "") {
    errors.push("Tipo de archivo no válido");
  }

  return { valid: errors.length === 0, errors };
};

const UploadXmlModal = ({
  open,
  onClose,
  onSuccess,
  facturaId,
}: UploadXmlModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [base64File, setBase64File] = useState("");
  const [fileName, setFileName] = useState("");
  const [touched, setTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateFactura, loading } = useFacturas();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTouched(true);

    // Validar archivo
    const validation = validateXmlFile(file);

    if (!validation.valid) {
      setAlertStatus("error");
      setAlertMessage(validation.errors.join(". "));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Limpiar alertas previas
    setAlertStatus(null);
    setAlertMessage("");

    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setBase64File(base64String);
      setFileName(file.name);
    };
    reader.onerror = () => {
      setAlertStatus("error");
      setAlertMessage("Error al leer el archivo");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setBase64File("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!base64File || !fileName) {
      setAlertStatus("error");
      setAlertMessage("Debe seleccionar un archivo XML");
      return;
    }

    try {
      await updateFactura(facturaId, {
        facturaNameFile: fileName,
        base64Factura: base64File,
      });

      setAlertStatus("success");
      setAlertMessage("Archivo XML subido correctamente.");
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al subir el archivo XML"
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
    setBase64File("");
    setFileName("");
    setTouched(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloudUploadIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Subir XML de Factura
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

        {alertStatus !== "success" && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Selecciona el archivo XML de la factura electrónica del SII.
          </Typography>
        )}

        {alertStatus !== "success" && (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}
            >
              Archivo XML
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="xml-upload-input"
            />

            {!base64File ? (
              <Box
                component="label"
                htmlFor="xml-upload-input"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: touched && !base64File ? "error.main" : "divider",
                  borderRadius: 2,
                  p: 4,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: "background.default",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(0, 188, 212, 0.04)",
                  },
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                />
                <Typography variant="body1" sx={{ color: "text.primary", mb: 0.5 }}>
                  Haz clic para seleccionar un archivo
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Archivo XML (máx. {formatFileSize(MAX_FILE_SIZE)})
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: "success.main",
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: "rgba(76, 175, 80, 0.08)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      backgroundColor: "success.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InsertDriveFileIcon sx={{ color: "white" }} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      maxWidth: 250,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fileName}
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleRemoveFile}
                  disabled={loading}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}

            {touched && !base64File && (
              <FormHelperText error sx={{ mt: 1 }}>
                Debe seleccionar un archivo XML
              </FormHelperText>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 3, gap: 2 }}>
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
          {alertStatus === "success" ? "Cerrar" : "Cancelar"}
        </Button>
        {alertStatus !== "success" && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !base64File}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "primary.main",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Subir Archivo"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadXmlModal;
