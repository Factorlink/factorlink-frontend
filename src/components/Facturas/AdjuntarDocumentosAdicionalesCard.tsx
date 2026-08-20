import { useRef, useState } from "react";
import { Box, Typography, IconButton, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatFileSize } from "../../utils/validations/file-fields";
import SectionPanel from "../SectionPanel";

const MAX_ADJUNTO_SIZE = 10 * 1024 * 1024;
const MAX_ADJUNTOS = 5;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export type FacturaAdjuntoPendiente = {
  id: string;
  nombreArchivo: string;
  archivoBase64: string;
  mimeType: string;
  size: number;
};

interface AdjuntarDocumentosAdicionalesCardProps {
  files: FacturaAdjuntoPendiente[];
  onChange: (files: FacturaAdjuntoPendiente[]) => void;
  disabled?: boolean;
}

const toRawBase64 = (dataUrl: string) =>
  dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;

const validateAdjunto = (file: File): string | null => {
  if (file.size > MAX_ADJUNTO_SIZE) {
    return `El archivo excede el tamaño máximo de ${formatFileSize(MAX_ADJUNTO_SIZE)}`;
  }

  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "Formatos permitidos: PDF, JPG, PNG";
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Tipo de archivo no permitido";
  }

  return null;
};

const readFileAsAdjunto = (file: File): Promise<FacturaAdjuntoPendiente> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        nombreArchivo: file.name,
        archivoBase64: toRawBase64(reader.result as string),
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      });
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });

const AdjuntarDocumentosAdicionalesCard = ({
  files,
  onChange,
  disabled = false,
}: AdjuntarDocumentosAdicionalesCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = async (selected: FileList | File[]) => {
    const incoming = Array.from(selected);
    if (incoming.length === 0) return;

    if (files.length >= MAX_ADJUNTOS) {
      setError(`Máximo ${MAX_ADJUNTOS} documentos adicionales`);
      return;
    }

    try {
        const next = [...files];
        let lastError: string | null = null;
        for (const file of incoming) {
          if (next.length >= MAX_ADJUNTOS) {
            lastError = `Máximo ${MAX_ADJUNTOS} documentos adicionales`;
            break;
          }

          const validationError = validateAdjunto(file);
          if (validationError) {
            lastError = `${file.name}: ${validationError}`;
            continue;
          }

          const alreadyAdded = next.some(
            (item) => item.nombreArchivo === file.name && item.size === file.size,
          );
          if (alreadyAdded) continue;

          next.push(await readFileAsAdjunto(file));
        }
        onChange(next);
        setError(lastError);
    } catch {
      setError("Error al leer el archivo");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      void addFiles(event.target.files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || files.length >= MAX_ADJUNTOS) return;
    void addFiles(event.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    onChange(files.filter((file) => file.id !== id));
  };

  const isAtMax = files.length >= MAX_ADJUNTOS;
  const isUploadDisabled = disabled || isAtMax;

  return (
    <SectionPanel
      title="Adjuntar documentos adicionales (opcional)"
      subtitle={`Puedes adjuntar hasta ${MAX_ADJUNTOS} documentos complementarios (${files.length}/${MAX_ADJUNTOS}).`}
      icon={<CloudUploadIcon sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="factura-adjuntos-upload"
        disabled={isUploadDisabled}
      />

      <Box
        component="label"
        htmlFor={isUploadDisabled ? undefined : "factura-adjuntos-upload"}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isUploadDisabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: "var(--radius-m)",
          p: 4,
          cursor: isUploadDisabled ? "default" : "pointer",
          transition: "all 0.2s ease",
          backgroundColor: isDragging
            ? "var(--color-bg-accent-tertiary-hover)"
            : "background.default",
          opacity: isAtMax ? 0.6 : 1,
          "&:hover": isUploadDisabled
            ? undefined
            : {
                borderColor: "primary.main",
                backgroundColor: "var(--color-bg-accent-tertiary-hover)",
              },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
        <Typography variant="body1" sx={{ color: "text.primary", mb: 0.5 }}>
          Arrastra y suelta archivos aquí o{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "var(--color-fg-accent-primary)" }}>
            selecciona
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {isAtMax
            ? `Has alcanzado el máximo de ${MAX_ADJUNTOS} documentos.`
            : `Formatos permitidos: PDF, JPG, PNG (Máx. ${formatFileSize(MAX_ADJUNTO_SIZE)} por archivo)`}
        </Typography>
      </Box>

      {files.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
          {files.map((file) => (
            <Box
              key={file.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: "success.main",
                borderRadius: "var(--radius-m)",
                p: 2,
                backgroundColor: "var(--color-bg-success-tertiary)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-s)",
                    backgroundColor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <InsertDriveFileIcon sx={{ color: "white" }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.nombreArchivo}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => handleRemoveFile(file.id)}
                disabled={disabled}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </SectionPanel>
  );
};

export default AdjuntarDocumentosAdicionalesCard;
