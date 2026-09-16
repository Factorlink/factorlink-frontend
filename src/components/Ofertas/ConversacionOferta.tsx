import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AttachFile,
  ChatBubbleOutline,
  Close,
  Description,
  Download,
  InsertDriveFile,
  PictureAsPdf,
  Send,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
  ComentarioArchivo,
  ComentarioOferta,
  ComentarioOfertaTipo,
} from "../../types/oferta";
import { useOfertas } from "../../hooks/useOfertas";
import { formatDateTime } from "../../utils/ofertaFormatters";
import {
  ALLOWED_EXTENSIONS,
  formatFileSize,
  MAX_ARCHIVOS_COMENTARIO,
  validateFile,
} from "../../utils/validations/file-fields";
import SectionPanel from "../SectionPanel";

const LADO_LABEL: Record<ComentarioOfertaTipo, string> = {
  EMPRESA: "Empresa",
  FACTORING: "Factoring",
};

const ACCEPT_ATTR = ALLOWED_EXTENSIONS.join(",");

const isImageMime = (mimeType: string) => mimeType.startsWith("image/");

const getDocumentoIcon = (
  mimeType: string,
  nombreArchivo: string,
): SvgIconComponent => {
  const extension = nombreArchivo
    .toLowerCase()
    .substring(nombreArchivo.lastIndexOf("."));
  const mime = mimeType.toLowerCase();

  if (mime === "application/pdf" || extension === ".pdf") {
    return PictureAsPdf;
  }
  if (
    mime === "application/msword" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".doc" ||
    extension === ".docx"
  ) {
    return Description;
  }
  return Description;
};
interface ConversacionOfertaProps {
  ofertaId: string;
  ladoActual: ComentarioOfertaTipo;
  /** Evita mostrar un panel vacío en ofertas que nunca tuvieron conversación. */
  ocultarSiVacia?: boolean;
  puedeComentar?: boolean;
  /**
   * Cada lado usa un endpoint distinto. Si resuelve con el comentario creado se
   * agrega a la lista; si resuelve vacío se recargan los comentarios.
   */
  onEnviarComentario?: (
    texto: string,
    archivos: File[],
  ) => Promise<ComentarioOferta | void>;
  placeholderComentario?: string;
  textoBotonEnviar?: string;
}

const ArchivosComentario = ({ archivos }: { archivos: ComentarioArchivo[] }) => {
  if (!archivos.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        mt: 1.5,
      }}
    >
      {archivos.map((archivo) => {
        const esImagen = isImageMime(archivo.mimeType);
        if (esImagen && archivo.signedUrl) {
          return (
            <Box key={archivo.id}>
              <Link
                href={archivo.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ display: "block" }}
              >
                <Box
                  component="img"
                  src={archivo.signedUrl}
                  alt={archivo.nombreArchivo}
                  sx={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: "var(--radius-s)",
                    objectFit: "contain",
                    border: "1px solid",
                    borderColor: "var(--color-border-default-primary)",
                    backgroundColor: "var(--color-bg-default-primary)",
                  }}
                />
              </Link>
              <Typography
                variant="caption"
                sx={{
                  color: "var(--color-fg-default-tertiary)",
                  display: "block",
                  mt: 0.5,
                }}
              >
                {archivo.nombreArchivo}
              </Typography>
            </Box>
          );
        }

        const DocumentoIcon = getDocumentoIcon(
          archivo.mimeType,
          archivo.nombreArchivo,
        );

        return (
          <Box
            key={archivo.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderRadius: "var(--radius-s)",
              border: "1px solid",
              borderColor: "var(--color-border-default-primary)",
              backgroundColor: "var(--color-bg-default-primary)",
            }}
          >
            <DocumentoIcon
              sx={{
                fontSize: 20,
                color: "var(--color-fg-default-secondary)",
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              {archivo.signedUrl ? (
                <Link
                  href={archivo.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={archivo.nombreArchivo}
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {archivo.nombreArchivo}
                </Link>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {archivo.nombreArchivo}
                </Typography>
              )}
            </Box>
            {archivo.signedUrl && (
              <IconButton
                size="small"
                component="a"
                href={archivo.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={archivo.nombreArchivo}
                aria-label={`Descargar ${archivo.nombreArchivo}`}
              >
                <Download fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const ConversacionOferta = ({
  ofertaId,
  ladoActual,
  ocultarSiVacia = false,
  puedeComentar = false,
  onEnviarComentario,
  placeholderComentario = "Escribe un comentario...",
  textoBotonEnviar = "Enviar comentario",
}: ConversacionOfertaProps) => {
  const { getComentarios } = useOfertas();
  const [comentarios, setComentarios] = useState<ComentarioOferta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [archivosPendientes, setArchivosPendientes] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchComentarios = async (mostrarCargando = true) => {
    const requestId = ++requestIdRef.current;
    if (mostrarCargando) setCargando(true);
    setError(null);
    try {
      const data = await getComentarios(ofertaId);
      if (requestId !== requestIdRef.current) return;
      setComentarios(data.items ?? []);
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) return;
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError?.response?.data?.message ||
          "No se pudieron cargar los comentarios.",
      );
    } finally {
      if (requestId === requestIdRef.current && mostrarCargando) {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [ofertaId]);

  const puedeEnviar = puedeComentar && Boolean(onEnviarComentario);
  const tieneTexto = Boolean(nuevoComentario.trim());

  const handleSelectArchivos = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    setErrorEnvio(null);
    const errores: string[] = [];
    const aceptados: File[] = [];

    for (const file of selected) {
      if (archivosPendientes.length + aceptados.length >= MAX_ARCHIVOS_COMENTARIO) {
        errores.push(
          `Máximo ${MAX_ARCHIVOS_COMENTARIO} archivos por comentario.`,
        );
        break;
      }
      const result = validateFile(file);
      if (!result.valid) {
        errores.push(`${file.name}: ${result.errors.join(", ")}`);
        continue;
      }
      const duplicado = [...archivosPendientes, ...aceptados].some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (duplicado) continue;
      aceptados.push(file);
    }

    if (aceptados.length) {
      setArchivosPendientes((prev) => [...prev, ...aceptados]);
    }
    if (errores.length) {
      setErrorEnvio(errores[0]);
    }
  };

  const handleRemoveArchivo = (index: number) => {
    setArchivosPendientes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEnviar = async () => {
    const texto = nuevoComentario.trim();
    if (!texto || !onEnviarComentario) {
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);
    try {
      const creado = await onEnviarComentario(texto, archivosPendientes);
      setNuevoComentario("");
      setArchivosPendientes([]);
      if (creado?.id) {
        setComentarios((prev) => [...prev, creado]);
      } else {
        await fetchComentarios(false);
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setErrorEnvio(
        axiosError?.response?.data?.message ||
          (err instanceof Error ? err.message : null) ||
          "No se pudo enviar el comentario.",
      );
    } finally {
      setEnviando(false);
    }
  };

  if (
    ocultarSiVacia &&
    !puedeEnviar &&
    !cargando &&
    !error &&
    comentarios.length === 0
  ) {
    return null;
  }

  return (
    <SectionPanel
      title="Comentarios"
      subtitle="Conversación entre la empresa y el factoring"
      icon={<ChatBubbleOutline sx={{ color: "primary.main", fontSize: 24 }} />}
    >
      {cargando && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            py: 4,
          }}
        >
          <CircularProgress size={22} />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Cargando comentarios...
          </Typography>
        </Box>
      )}

      {!cargando && error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchComentarios()}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!cargando && !error && comentarios.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            py: 4,
          }}
        >
          <ChatBubbleOutline
            sx={{ fontSize: 40, color: "var(--color-fg-default-tertiary)" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            {puedeEnviar
              ? "Todavía no hay comentarios. Escribe el primero para iniciar la conversación."
              : "Todavía no hay comentarios en esta oferta."}
          </Typography>
        </Box>
      )}

      {!cargando && !error && comentarios.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 420,
            overflowY: "auto",
          }}
        >
          {comentarios.map((comentario) => {
            const esPropio = comentario.usuario.tipo === ladoActual;
            return (
              <Box
                key={comentario.id}
                sx={{
                  display: "flex",
                  justifyContent: esPropio ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: "100%", sm: "85%" },
                    p: 1.5,
                    borderRadius: "var(--radius-m)",
                    border: "1px solid",
                    backgroundColor: esPropio
                      ? "var(--color-bg-accent-secondary)"
                      : "var(--color-bg-default-tertiary)",
                    borderColor: esPropio
                      ? "var(--color-border-accent-primary)"
                      : "var(--color-border-default-primary)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "var(--color-fg-default-primary)",
                      }}
                    >
                      {comentario.usuario.nombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--color-fg-default-tertiary)" }}
                    >
                      {LADO_LABEL[comentario.usuario.tipo]} ·{" "}
                      {formatDateTime(comentario.createdAt)}
                    </Typography>
                  </Box>
                  {comentario.comentario ? (
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap",
                        color: "var(--color-fg-default-primary)",
                      }}
                    >
                      {comentario.comentario}
                    </Typography>
                  ) : null}
                  <ArchivosComentario archivos={comentario.archivos ?? []} />
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {puedeEnviar && !cargando && (
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {errorEnvio && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorEnvio(null)}>
              {errorEnvio}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            placeholder={placeholderComentario}
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            disabled={enviando}
            inputProps={{ maxLength: 500 }}
          />

          {archivosPendientes.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1.5,
              }}
            >
              {archivosPendientes.map((file, index) => (
                <Chip
                  key={`${file.name}-${file.size}-${index}`}
                  icon={<InsertDriveFile />}
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  onDelete={enviando ? undefined : () => handleRemoveArchivo(index)}
                  deleteIcon={<Close />}
                  variant="outlined"
                  sx={{ maxWidth: "100%" }}
                />
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mt: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                accept={ACCEPT_ATTR}
                onChange={handleSelectArchivos}
              />
              <Tooltip
                title={`Adjuntar archivos (máx. ${MAX_ARCHIVOS_COMENTARIO})`}
              >
                <span>
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      enviando ||
                      archivosPendientes.length >= MAX_ARCHIVOS_COMENTARIO
                    }
                    aria-label="Adjuntar archivos"
                    size="small"
                  >
                    <AttachFile />
                  </IconButton>
                </span>
              </Tooltip>
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-tertiary)" }}
              >
                {nuevoComentario.length}/500
                {archivosPendientes.length > 0
                  ? ` · ${archivosPendientes.length}/${MAX_ARCHIVOS_COMENTARIO} archivos`
                  : ""}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={enviando ? undefined : <Send />}
              onClick={handleEnviar}
              disabled={enviando || !tieneTexto}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "var(--radius-m)",
                color: "var(--color-fg-on-accent-primary)",
              }}
            >
              {enviando ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                textoBotonEnviar
              )}
            </Button>
          </Box>
        </Box>
      )}
    </SectionPanel>
  );
};

export default ConversacionOferta;
