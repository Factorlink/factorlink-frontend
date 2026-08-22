import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  Cancel,
  CheckCircle,
  Comment,
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import type { Oferta } from "../../types/oferta";
import {
  formatDateOnly,
  formatMoney,
  formatPercent,
} from "../../utils/ofertaFormatters";
import { isOfertaCondicionada } from "../../utils/ofertaEstados";
import ConversacionOferta from "./ConversacionOferta";
import OfertaCamposDetalle from "./OfertaCamposDetalle";

const ESTADO_CHIP: Record<string, { label: string; fg: string; bg: string }> = {
  activa: {
    label: "Activa",
    fg: "var(--color-fg-success-primary)",
    bg: "var(--color-bg-success-secondary)",
  },
  aceptada: {
    label: "Aceptada",
    fg: "var(--color-fg-success-primary)",
    bg: "var(--color-bg-success-secondary)",
  },
  rechazada: {
    label: "Rechazada",
    fg: "var(--color-fg-danger-primary)",
    bg: "var(--color-bg-danger-secondary)",
  },
  expirada: {
    label: "Expirada",
    fg: "var(--color-fg-warning-primary)",
    bg: "var(--color-bg-warning-secondary)",
  },
  inactiva: {
    label: "Inactiva",
    fg: "var(--color-fg-accent-primary)",
    bg: "var(--color-bg-accent-secondary)",
  },
};

const getEstadoChipConfig = (estado: string) =>
  ESTADO_CHIP[estado?.toLowerCase() || ""] ?? {
    label: "Recibida",
    fg: "var(--color-fg-accent-primary)",
    bg: "var(--color-bg-accent-secondary)",
  };

interface OfertaRecibidaCardProps {
  oferta: Oferta;
  plazo: number;
  expandida: boolean;
  disponible: boolean;
  mostrarAcciones: boolean;
  puedeComentar: boolean;
  onToggle: () => void;
  onAceptar: () => void;
  onRechazar: () => void;
  onEnviarComentario: (texto: string) => Promise<void>;
  cardRef?: (el: HTMLDivElement | null) => void;
}

const OfertaRecibidaCard = ({
  oferta,
  plazo,
  expandida,
  disponible,
  mostrarAcciones,
  puedeComentar,
  onToggle,
  onAceptar,
  onRechazar,
  onEnviarComentario,
  cardRef,
}: OfertaRecibidaCardProps) => {
  const estadoChip = getEstadoChipConfig(oferta.estado);
  const condicionada = isOfertaCondicionada(oferta);

  const resumen = [
    {
      label: "% Financiamiento",
      value: formatPercent(oferta.porcentajeFinanciamiento),
      color: "var(--color-fg-success-primary)",
    },
    {
      label: "Tasa",
      value: formatPercent(oferta.tasa),
      color: "var(--color-fg-default-primary)",
    },
    {
      label: "Monto adelanto",
      value: formatMoney(oferta.montoAdelanto),
      color: "var(--color-fg-success-primary)",
    },
    {
      label: "Plazo",
      value: `${plazo} días`,
      color: "var(--color-fg-default-primary)",
    },
    {
      label: "Fecha expiración",
      value: formatDateOnly(oferta.fechaExpiracion),
      color: disponible
        ? "var(--color-fg-default-primary)"
        : "var(--color-fg-danger-primary)",
    },
  ];

  return (
    <Paper
      ref={cardRef}
      sx={{
        borderRadius: 3,
        mb: 2,
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border-default-primary)",
        opacity: disponible ? 1 : 0.6,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          p: 2.5,
          cursor: "pointer",
          "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
        }}
        onClick={onToggle}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "var(--color-fg-default-primary)",
                }}
              >
                {oferta.factoring?.razonSocial || "N/A"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                {oferta.factoring?.rut || ""}
              </Typography>
            </Box>

            {condicionada && (
              <Chip
                icon={<InfoOutlined sx={{ fontSize: 16 }} />}
                label="Oferta condicionada"
                size="small"
                sx={{
                  backgroundColor: "var(--color-bg-warning-secondary)",
                  color: "var(--color-fg-warning-primary)",
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color: "var(--color-fg-warning-primary)",
                  },
                }}
              />
            )}
            <Chip
              label={estadoChip.label}
              size="small"
              sx={{
                backgroundColor: estadoChip.bg,
                color: estadoChip.fg,
                fontWeight: 600,
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: "repeat(5, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {resumen.map((item) => (
              <Box key={item.label}>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: item.color }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <IconButton size="small" sx={{ flexShrink: 0 }}>
          {expandida ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>

      <Collapse in={expandida} timeout="auto" unmountOnExit>
        <Box
          sx={{
            px: 2.5,
            pb: 2.5,
            borderTop: "1px solid var(--color-border-default-primary)",
            pt: 2.5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "var(--color-fg-default-primary)",
                  mb: 2,
                }}
              >
                Información de la oferta
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}
              >
                <Comment
                  sx={{
                    fontSize: 18,
                    color: "var(--color-fg-default-secondary)",
                    mt: 0.3,
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "var(--color-fg-default-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    Comentario del factoring
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-primary)", mt: 0.5 }}
                  >
                    {oferta.comentario || "Sin comentario"}
                  </Typography>
                </Box>
              </Box>

              <OfertaCamposDetalle oferta={oferta} />
            </Box>

            <ConversacionOferta
              ofertaId={oferta.id}
              ladoActual="EMPRESA"
              puedeComentar={puedeComentar}
              onEnviarComentario={onEnviarComentario}
              placeholderComentario="Escribe una respuesta para el factoring..."
              textoBotonEnviar="Responder oferta"
            />
          </Box>

          {mostrarAcciones && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 1,
                pt: 2.5,
                borderTop: "1px solid var(--color-border-default-primary)",
              }}
            >
              {!condicionada && (
                <Button
                  variant="contained"
                  startIcon={<CheckCircle />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAceptar();
                  }}
                  sx={{
                    backgroundColor: "var(--color-bg-success-primary)",
                    color: "var(--color-fg-on-accent-primary)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "var(--color-bg-success-primary-hover)",
                    },
                  }}
                >
                  Aceptar oferta
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={(e) => {
                  e.stopPropagation();
                  onRechazar();
                }}
                sx={{
                  borderColor: "var(--color-fg-danger-primary)",
                  color: "var(--color-fg-danger-primary)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: "var(--color-border-danger-secondary)",
                    backgroundColor: "var(--color-bg-danger-secondary)",
                  },
                }}
              >
                Rechazar oferta
              </Button>

              {condicionada && (
                <Typography
                  variant="caption"
                  sx={{
                    alignSelf: "center",
                    color: "var(--color-fg-default-secondary)",
                  }}
                >
                  Responde en la conversación para negociar las condiciones.
                  Podrás aceptar la oferta cuando el factoring envíe la oferta
                  final.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default OfertaRecibidaCard;
