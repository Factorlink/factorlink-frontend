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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuthStore from "../../store/authStore";
import { useLegalDocuments } from "../../hooks/useLegalDocuments";
import { EMPRESA_DOCUMENTOS, FACTORING_DOCUMENTOS } from "../../utils/consts";
import { validateFile, formatFileSize, MAX_FILE_SIZE } from "../../utils/validations/file-fields";

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UploadFormData {
  tipo: string;
  archivoBase64: string;
  nombreArchivo: string;
}

const UploadDocumentModal = ({
  open,
  onClose,
  onSuccess,
}: UploadDocumentModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentRole } = useAuthStore();
  const { createLegalDocument, loading } = useLegalDocuments();

  const isEmpresa = currentRole?.contexto === "empresa";
  const documentOptions = isEmpresa ? EMPRESA_DOCUMENTOS : FACTORING_DOCUMENTOS;

  const validationSchema = Yup.object({
    tipo: Yup.string().required("El tipo de documento es requerido"),
    archivoBase64: Yup.string().required("Debe seleccionar un archivo"),
    nombreArchivo: Yup.string().when("tipo", {
      is: "otros_documentos_legales",
      then: (schema) => schema.required("El nombre del documento es requerido"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ejecutar validaciones de seguridad
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setAlertStatus("error");
      setAlertMessage(validation.errors.join(". "));
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Proceder con la conversión a Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      formik.setFieldValue("archivoBase64", base64String, true);
      // Quitar la extensión del nombre del archivo para que no se duplique con el adornment .pdf
      // Y limitar a 26 caracteres (30 - 4 de ".pdf")
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "").slice(0, 26);
      formik.setFieldValue("nombreArchivo", nameWithoutExtension, true);
    };
    reader.onerror = () => {
      setAlertStatus("error");
      setAlertMessage("Error al leer el archivo");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    formik.setFieldValue("archivoBase64", "");
    formik.setFieldValue("nombreArchivo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values: UploadFormData) => {
    try {
      const isOtrosDocumentos = values.tipo === "otros_documentos_legales";
      // Asegurar que el nombre del archivo siempre termine en .pdf
      const finalNombreArchivo = isOtrosDocumentos && values.nombreArchivo
        ? (values.nombreArchivo.toLowerCase().endsWith(".pdf") 
            ? values.nombreArchivo 
            : `${values.nombreArchivo}.pdf`)
        : values.nombreArchivo;

      const payload = isEmpresa
        ? {
            empresaId: currentRole?.empresaId || null,
            tipo: values.tipo,
            archivoBase64: values.archivoBase64,
            ...(isOtrosDocumentos && values.nombreArchivo
              ? { nombreArchivo: finalNombreArchivo }
              : {}),
          }
        : {
            factoringId: currentRole?.factoringId || null,
            tipo: values.tipo,
            archivoBase64: values.archivoBase64,
            ...(isOtrosDocumentos && values.nombreArchivo
              ? { nombreArchivo: finalNombreArchivo }
              : {}),
          };

      await createLegalDocument(payload);

      setAlertStatus("success");
      setAlertMessage("Documento subido correctamente.");
      onSuccess?.();
      handleClose();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al subir el documento"
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
    formik.resetForm();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const formik = useFormik<UploadFormData>({
    initialValues: {
      tipo: "",
      archivoBase64: "",
      nombreArchivo: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

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
            Subir Documento
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
            Selecciona el tipo de documento y sube el archivo correspondiente.
          </Typography>
        )}

        {alertStatus !== "success" && (
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              fullWidth
              error={formik.touched.tipo && Boolean(formik.errors.tipo)}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              <InputLabel id="tipo-select-label">Tipo de Documento</InputLabel>
              <Select
                labelId="tipo-select-label"
                id="tipo"
                name="tipo"
                value={formik.values.tipo}
                label="Tipo de Documento"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{
                  borderRadius: 1,
                  backgroundColor: "background.default",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      formik.touched.tipo && formik.errors.tipo
                        ? "error.main"
                        : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      formik.touched.tipo && formik.errors.tipo
                        ? "error.main"
                        : "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      formik.touched.tipo && formik.errors.tipo
                        ? "error.main"
                        : "primary.main",
                  },
                }}
              >
                {documentOptions.map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.tipo && formik.errors.tipo && (
                <FormHelperText>{formik.errors.tipo}</FormHelperText>
              )}
            </FormControl>

            {formik.values.tipo === "otros_documentos_legales" && (
              <TextField
                fullWidth
                id="nombreArchivo"
                name="nombreArchivo"
                label="Nombre del documento"
                placeholder="Ej: Contrato de cesión, Poder notarial..."
                error={formik.touched.nombreArchivo && Boolean(formik.errors.nombreArchivo)}
                helperText={
                  (formik.touched.nombreArchivo && formik.errors.nombreArchivo) ||
                  `${formik.values.nombreArchivo.length + 4}/30 caracteres`
                }
                value={formik.values.nombreArchivo}
                onChange={(e) => {
                  const val = e.target.value;
                  // Limitar a 26 caracteres (30 - 4 de ".pdf")
                  if (val.length > 26) return;

                  // Si el usuario escribe .pdf, lo quitamos para no duplicar con el adornment
                  if (val.toLowerCase().endsWith(".pdf")) {
                    formik.setFieldValue("nombreArchivo", val.slice(0, -4));
                  } else {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">.pdf</InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    backgroundColor: "background.default",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        formik.touched.nombreArchivo && formik.errors.nombreArchivo
                          ? "error.main"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        formik.touched.nombreArchivo && formik.errors.nombreArchivo
                          ? "error.main"
                          : "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        formik.touched.nombreArchivo && formik.errors.nombreArchivo
                          ? "error.main"
                          : "primary.main",
                    },
                  },
                }}
              />
            )}

            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1, fontWeight: 500 }}
              >
                Archivo
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload-input"
              />

              {!formik.values.archivoBase64 ? (
                <Box
                  component="label"
                  htmlFor="file-upload-input"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed",
                    borderColor:
                      formik.touched.archivoBase64 && formik.errors.archivoBase64
                        ? "error.main"
                        : "divider",
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
                    PDF, DOC, DOCX, JPG, PNG (máx. {formatFileSize(MAX_FILE_SIZE)})
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
                      {formik.values.nombreArchivo}
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

              {formik.touched.archivoBase64 && formik.errors.archivoBase64 && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {formik.errors.archivoBase64}
                </FormHelperText>
              )}
            </Box>
          </form>
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
            onClick={() => formik.handleSubmit()}
            disabled={
              loading || 
              !formik.values.tipo || 
              !formik.values.archivoBase64 || 
              (formik.values.tipo === "otros_documentos_legales" && !formik.values.nombreArchivo)
            }
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
              "Subir Documento"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentModal;
