import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";
import type {
  ComentarioOferta,
  ComentarioOfertaTipo,
} from "../../types/oferta";
import { useOfertas } from "../../hooks/useOfertas";
import { formatDateTime } from "../../utils/ofertaFormatters";
import SectionPanel from "../SectionPanel";

const LADO_LABEL: Record<ComentarioOfertaTipo, string> = {
  EMPRESA: "Empresa",
  FACTORING: "Factoring",
};

interface ConversacionOfertaProps {
  ofertaId: string;
  ladoActual: ComentarioOfertaTipo;
  /** Evita mostrar un panel vacío en ofertas que nunca tuvieron conversación. */
  ocultarSiVacia?: boolean;
}

const ConversacionOferta = ({
  ofertaId,
  ladoActual,
  ocultarSiVacia = false,
}: ConversacionOfertaProps) => {
  const { getComentarios } = useOfertas();
  const [comentarios, setComentarios] = useState<ComentarioOferta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchComentarios = async () => {
    const requestId = ++requestIdRef.current;
    setCargando(true);
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
      if (requestId === requestIdRef.current) setCargando(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [ofertaId]);

  if (ocultarSiVacia && !cargando && !error && comentarios.length === 0) {
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
              onClick={fetchComentarios}
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
            Todavía no hay comentarios en esta oferta.
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
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      color: "var(--color-fg-default-primary)",
                    }}
                  >
                    {comentario.comentario}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </SectionPanel>
  );
};

export default ConversacionOferta;
