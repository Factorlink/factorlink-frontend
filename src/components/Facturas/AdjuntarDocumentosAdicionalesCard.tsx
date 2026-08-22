import { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatFileSize } from "../../utils/validations/file-fields";
import SectionPanel from "../SectionPanel";
import type { FacturaArchivo } from "../../types/factura";

const MAX_ADJUNTO_SIZE = 10 * 1024 * 1024;
const MAX_ADJUNTOS = 5;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export type FacturaAdjuntoUploadPayload = {
  nombreArchivo: string;
  archivoBase64: string;
  mimeType: string;
};

interface AdjuntarDocumentosAdicionalesCardProps {
  files: FacturaArchivo[];
  onChange?: (files: FacturaArchivo[]) => void;
  onUpload?: (payload: FacturaAdjuntoUploadPayload) => Promise<FacturaArchivo>;
  onDelete?: (archivoId: string) => Promise<void>;
  facturaId: string;
  disabled?: boolean;
  variant?: "panel" | "embedded";
  readOnly?: boolean;
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

const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(toRawBase64(reader.result as string));
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });

const AdjuntarDocumentosAdicionalesCard = ({
  files,
  onChange,
  onUpload,
  onDelete,
  facturaId,
  disabled = false,
  variant = "panel",
  readOnly = false,
}: AdjuntarDocumentosAdicionalesCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputId =
    variant === "embedded"
      ? "factura-adjuntos-upload-embedded"
      : "factura-adjuntos-upload";

  const addFiles = async (selected: FileList | File[]) => {
    const incoming = Array.from(selected);
    if (incoming.length === 0 || !facturaId || readOnly || !onUpload || !onChange) {
      return;
    }

    if (files.length >= MAX_ADJUNTOS) {
      setError(`Máximo ${MAX_ADJUNTOS} documentos adicionales`);
      return;
    }

    setUploading(true);
    setError(null);

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
          (item) => item.nombreArchivo === file.name,
        );
        if (alreadyAdded) continue;

        setUploadingName(file.name);
        try {
          const archivoBase64 = await readFileAsBase64(file);
          const mimeType = file.type || "application/octet-stream";
          const uploaded = await onUpload({
            nombreArchivo: file.name,
            archivoBase64,
            mimeType,
          });
          next.push(uploaded);
          onChange([...next]);
        } catch {
          lastError = `${file.name}: Error al subir el archivo. Intente nuevamente.`;
        }
      }

      setError(lastError);
    } catch {
      setError("Error al leer el archivo");
    } finally {
      setUploading(false);
      setUploadingName(null);
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
    if (
      readOnly ||
      disabled ||
      uploading ||
      deletingId ||
      files.length >= MAX_ADJUNTOS
    ) {
      return;
    }
    void addFiles(event.dataTransfer.files);
  };

  const handleRemoveFile = async (archivoId: string) => {
    if (readOnly || !onDelete || !onChange) return;
    setError(null);
    setDeletingId(archivoId);
    try {
      await onDelete(archivoId);
      onChange(files.filter((file) => file.id !== archivoId));
    } catch {
      setError("Error al eliminar el archivo. Intente nuevamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const isAtMax = files.length >= MAX_ADJUNTOS;
  const isBusy = uploading || Boolean(deletingId);
  const isUploadDisabled = readOnly || disabled || isAtMax || isBusy;

  const content = (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!readOnly && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            id={inputId}
            disabled={isUploadDisabled}
          />

          <Box
            component="label"
            htmlFor={isUploadDisabled ? undefined : inputId}
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
            {uploading ? (
              <>
                <CircularProgress size={40} sx={{ mb: 1.5 }} />
                <Typography variant="body1" sx={{ color: "text.primary", mb: 0.5 }}>
                  Subiendo{uploadingName ? ` ${uploadingName}` : ""}…
                </Typography>
              </>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                <Typography variant="body1" sx={{ color: "text.primary", mb: 0.5 }}>
                  Arrastra y suelta archivos aquí o{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "var(--color-fg-accent-primary)" }}
                  >
                    selecciona
                  </Box>
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {isAtMax
                    ? `Has alcanzado el máximo de ${MAX_ADJUNTOS} documentos.`
                    : `Formatos permitidos: PDF, JPG, PNG (Máx. ${formatFileSize(MAX_ADJUNTO_SIZE)} por archivo)`}
                </Typography>
              </>
            )}
          </Box>
        </>
      )}

      {files.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: readOnly ? 0 : 2,
          }}
        >
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
                  {file.signedUrl ? (
                    <Link
                      href={file.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {file.nombreArchivo}
                    </Link>
                  ) : (
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
                  )}
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {file.mimeType}
                  </Typography>
                </Box>
              </Box>
              {!readOnly && (
                <IconButton
                  onClick={() => void handleRemoveFile(file.id)}
                  disabled={disabled || isBusy}
                  sx={{ color: "error.main" }}
                >
                  {deletingId === file.id ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}
    </>
  );

  if (variant === "embedded") {
    return (
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)", mb: 0.5 }}
        >
          Documentos adicionales
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "var(--color-fg-default-secondary)", display: "block", mb: 2 }}
        >
          {readOnly
            ? `${files.length} documento${files.length === 1 ? "" : "s"} adicional${files.length === 1 ? "" : "es"}`
            : `Hasta ${MAX_ADJUNTOS} documentos complementarios (${files.length}/${MAX_ADJUNTOS})`}
        </Typography>
        {content}
      </Box>
    );
  }

  return (
    <SectionPanel
      title="Adjuntar documentos adicionales (opcional)"
      subtitle={`Puedes adjuntar hasta ${MAX_ADJUNTOS} documentos complementarios (${files.length}/${MAX_ADJUNTOS}).`}
      icon={<CloudUploadIcon sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />}
    >
      {content}
    </SectionPanel>
  );
};

export default AdjuntarDocumentosAdicionalesCard;
