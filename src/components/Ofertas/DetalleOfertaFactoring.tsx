import { useState } from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import {
  Send,
  AccessTime,
  Percent,
  AccountBalance,
  CalendarToday,
  CheckCircle,
  Cancel,
  ChatBubbleOutline,
  DeleteOutline,
  InfoOutlined,
} from "@mui/icons-material";
import type { Oferta } from "../../types/oferta";
import { formatMoney } from "../../utils/ofertaFormatters";
import {
  isOfertaCondicionada,
  normalizeOfertaEstado,
  puedeCancelar,
  OFERTA_ESTADOS,
} from "../../utils/ofertaEstados";
import SectionPanel from "../SectionPanel";
import OfertaCamposDetalle from "./OfertaCamposDetalle";
import CancelarOfertaModal from "../Modals/CancelarOfertaModal";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEstadoConfig = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "aceptada":
      return { label: "Aceptada", color: "var(--color-fg-success-primary)", bg: "var(--color-bg-success-secondary)" };
    case "rechazada":
      return { label: "Rechazada", color: "var(--color-fg-danger-primary)", bg: "var(--color-bg-danger-secondary)" };
    case "expirada":
      return { label: "Expirada", color: "var(--color-fg-warning-primary)", bg: "var(--color-bg-warning-secondary)" };
    case "activa":
      return { label: "Activa", color: "var(--color-fg-accent-primary)", bg: "var(--color-bg-accent-secondary)" };
    case "inactiva":
      return { label: "Inactiva", color: "var(--color-fg-accent-primary)", bg: "var(--color-bg-accent-secondary)" };
    default:
      return { label: estado, color: "var(--color-fg-accent-primary)", bg: "var(--color-bg-accent-secondary)" };
  }
};

const getEstadoBanner = (oferta: Oferta) => {
  switch (normalizeOfertaEstado(oferta.estado)) {
    case OFERTA_ESTADOS.ACEPTADA:
      return {
        icon: CheckCircle,
        text: "La empresa aceptó tu oferta.",
        color: "var(--color-fg-success-primary)",
        bg: "var(--color-bg-success-secondary)",
      };
    case OFERTA_ESTADOS.RECHAZADA:
      return {
        icon: Cancel,
        text: "La empresa rechazó tu oferta.",
        color: "var(--color-fg-danger-primary)",
        bg: "var(--color-bg-danger-secondary)",
      };
    case OFERTA_ESTADOS.EXPIRADA:
      return {
        icon: AccessTime,
        text: "Tu oferta expiró sin respuesta de la empresa.",
        color: "var(--color-fg-warning-primary)",
        bg: "var(--color-bg-warning-secondary)",
      };
    case OFERTA_ESTADOS.INACTIVA:
      return {
        icon: AccessTime,
        text: "Tu oferta ya no está vigente.",
        color: "var(--color-fg-warning-primary)",
        bg: "var(--color-bg-warning-secondary)",
      };
    default:
      return isOfertaCondicionada(oferta)
        ? {
            icon: ChatBubbleOutline,
            text: "Tu oferta está condicionada. La empresa podrá responderte con comentarios, pero no aceptarla hasta que envíes la oferta final.",
            color: "var(--color-fg-accent-primary)",
            bg: "var(--color-bg-accent-secondary)",
          }
        : {
            icon: AccessTime,
            text: "Tu oferta está en revisión por la empresa emisora.",
            color: "var(--color-fg-accent-primary)",
            bg: "var(--color-bg-accent-secondary)",
          };
  }
};

interface DetalleOfertaFactoringProps {
  oferta: Oferta;
  plazo: number;
  onOfertaCancelada?: () => void;
}

const DetalleOfertaFactoring = ({
  oferta,
  plazo,
  onOfertaCancelada,
}: DetalleOfertaFactoringProps) => {
  const [cancelarOpen, setCancelarOpen] = useState(false);
  const estadoConfig = getEstadoConfig(oferta.estado);
  const banner = getEstadoBanner(oferta);
  const BannerIcon = banner.icon;
  const condicionada = isOfertaCondicionada(oferta);

  return (
    <SectionPanel
      title="Estado de tu oferta"
      icon={<Send sx={{ color: "primary.main", fontSize: 24 }} />}
    >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              borderRadius: 2,
              backgroundColor: banner.bg,
              mb: 3,
            }}
          >
            <BannerIcon sx={{ color: banner.color, fontSize: 20, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: banner.color }}>
              {banner.text}
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Tu oferta
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                }}
              >
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
                  icon={<AccessTime sx={{ fontSize: 16 }} />}
                  label={estadoConfig.label}
                  size="small"
                  sx={{
                    backgroundColor: estadoConfig.bg,
                    color: estadoConfig.color,
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: estadoConfig.color },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 3,
                mb: 3,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <Percent sx={{ fontSize: 16, color: "var(--color-fg-default-secondary)" }} />
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Financiamiento
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {oferta.porcentajeFinanciamiento}%
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <Percent sx={{ fontSize: 16, color: "var(--color-fg-default-secondary)" }} />
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Tasa
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {oferta.tasa}%
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <AccountBalance sx={{ fontSize: 16, color: "var(--color-fg-default-secondary)" }} />
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Monto adelanto
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {formatMoney(oferta.montoAdelanto)}
                </Typography>
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <AccessTime sx={{ fontSize: 16, color: "var(--color-fg-default-secondary)" }} />
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Plazo
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {plazo} días
                </Typography>
              </Box>
            </Box>

            <OfertaCamposDetalle oferta={oferta} />

            <Box
              sx={{
                display: "flex",
                gap: 3,
                mb: oferta.comentario ? 3 : 0,
                mt: 3,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 16, color: "var(--color-fg-default-tertiary)" }} />
                <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Enviada: {formatDate(oferta.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 16, color: "var(--color-fg-default-tertiary)" }} />
                <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Expira: {formatDateShort(oferta.fechaExpiracion)}
                </Typography>
              </Box>
            </Box>

            {oferta.comentario && (
              <Box
                sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Comentario:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {oferta.comentario}
                </Typography>
              </Box>
            )}

            {puedeCancelar(oferta) && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutline />}
                  onClick={() => setCancelarOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "var(--radius-m)",
                    color: "var(--color-fg-danger-primary)",
                    borderColor: "var(--color-border-danger-secondary)",
                    "&:hover": {
                      borderColor: "var(--color-fg-danger-primary)",
                      backgroundColor: "var(--color-bg-danger-secondary)",
                    },
                  }}
                >
                  Cancelar oferta
                </Button>
              </Box>
            )}
          </Box>

      <CancelarOfertaModal
        open={cancelarOpen}
        onClose={() => setCancelarOpen(false)}
        onSuccess={onOfertaCancelada}
        oferta={oferta}
      />
    </SectionPanel>
  );
};

export default DetalleOfertaFactoring;
