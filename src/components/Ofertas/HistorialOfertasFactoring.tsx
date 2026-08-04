import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  History,
  ExpandMore,
  ExpandLess,
  Percent,
  AccountBalance,
  AccessTime,
  CalendarToday,
  Comment,
  ChatBubbleOutline,
  Cancel,
  WarningAmber,
  CheckCircle,
} from "@mui/icons-material";
import type { Oferta } from "../../types/oferta";
import CollapsibleSection from "../CollapsibleSection";

const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(num);
};

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
      return { label: "Aceptada", color: "var(--color-fg-success-primary)", bg: "var(--color-bg-success-secondary)", icon: <CheckCircle sx={{ fontSize: 16 }} /> };
    case "rechazada":
      return { label: "Rechazada", color: "var(--color-fg-danger-primary)", bg: "var(--color-bg-danger-secondary)", icon: <Cancel sx={{ fontSize: 16 }} /> };
    case "expirada":
      return { label: "Expirada", color: "var(--color-fg-warning-primary)", bg: "var(--color-bg-warning-secondary)", icon: <WarningAmber sx={{ fontSize: 16 }} /> };
    case "activa":
      return { label: "Activa", color: "var(--color-fg-accent-primary)", bg: "var(--color-bg-accent-secondary)", icon: <AccessTime sx={{ fontSize: 16 }} /> };
    default:
      return { label: estado, color: "var(--color-fg-accent-primary)", bg: "var(--color-bg-accent-secondary)", icon: <AccessTime sx={{ fontSize: 16 }} /> };
  }
};

interface HistorialOfertasFactoringProps {
  ofertas: Oferta[];
  plazo: number;
}

const HistorialOfertasFactoring = ({ ofertas, plazo }: HistorialOfertasFactoringProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const conteo = ofertas.reduce(
    (acc, o) => {
      const estado = o.estado?.toLowerCase() || "";
      if (estado === "activa") acc.activa++;
      else if (estado === "aceptada") acc.aceptada++;
      else if (estado === "rechazada") acc.rechazada++;
      else if (estado === "expirada") acc.expirada++;
      else if (estado === "inactiva") acc.inactiva++;
      return acc;
    },
    { activa: 0, aceptada: 0, rechazada: 0, expirada: 0, inactiva: 0 }
  );

  const resumenItems = [
    { label: "Activas", count: conteo.activa, color: "var(--color-fg-accent-primary)", bg: "var(--color-bg-accent-secondary)" },
    { label: "Aceptadas", count: conteo.aceptada, color: "var(--color-fg-success-primary)", bg: "var(--color-bg-success-secondary)" },
    { label: "Rechazadas", count: conteo.rechazada, color: "var(--color-fg-danger-primary)", bg: "var(--color-bg-danger-secondary)" },
    { label: "Expiradas", count: conteo.expirada, color: "var(--color-fg-warning-primary)", bg: "var(--color-bg-warning-secondary)" },
    { label: "Inactivas", count: conteo.inactiva, color: "var(--color-fg-default-secondary)", bg: "var(--color-bg-default-tertiary)" },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <CollapsibleSection
      title={
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            Historial de ofertas anteriores
          </Typography>
      }
      subtitle={
        <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            {ofertas.length} oferta{ofertas.length !== 1 ? "s" : ""} en total
          </Typography>
      }
      icon={<History sx={{ color: "primary.main", fontSize: 24 }} />}
    >
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        boxShadow: "var(--shadow-popover)",
        overflow: "hidden",
        mt: 3,
      }}
    >

      {/* Resumen de estados */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
        }}
      >
        {resumenItems.map((item) => (
          <Chip
            key={item.label}
            label={`${item.label}: ${item.count}`}
            size="small"
            sx={{
              backgroundColor: item.bg,
              color: item.color,
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          />
        ))}
      </Box>

      {/* Ofertas list */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {ofertas.map((oferta, index) => {
          const isExpanded = expandedId === oferta.id;
          const estadoConfig = getEstadoConfig(oferta.estado);

          return (
            <Box
              key={oferta.id}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {/* Collapsed header */}
              <Box
                onClick={() => toggleExpand(oferta.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
                  transition: "background-color 0.2s",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      backgroundColor: "var(--color-bg-default-tertiary)",
                      color: "var(--color-fg-default-secondary)",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
                    {formatDateShort(oferta.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Tasa {oferta.tasa}% · {formatCurrency(oferta.montoAdelanto)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    icon={estadoConfig.icon}
                    label={estadoConfig.label}
                    size="small"
                    sx={{
                      backgroundColor: estadoConfig.bg,
                      color: estadoConfig.color,
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: estadoConfig.color },
                    }}
                  />
                  <IconButton size="small">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              {/* Expanded content */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ px: 3, pb: 3, pt: 1 }}>
                  {/* Data grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                        <AccountBalance sx={{ fontSize: 16, color: "var(--color-fg-default-secondary)" }} />
                        <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                          Monto adelanto
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {formatCurrency(oferta.montoAdelanto)}
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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

                  {/* Dates */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mb: 3,
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
                        Expiración: {formatDateShort(oferta.fechaExpiracion)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Comment */}
                  {oferta.comentario && (
                    <Box
                      sx={{
                        backgroundColor: "var(--color-bg-default-tertiary)",
                        borderRadius: 2,
                        p: 2,
                        mb: oferta.comentarioEmpresa ? 2 : 0,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <Comment sx={{ fontSize: 16, color: "var(--color-fg-default-secondary)" }} />
                        <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 600 }}>
                          Tu comentario:
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontStyle: "italic", color: "var(--color-fg-default-primary)" }}>
                        "{oferta.comentario}"
                      </Typography>
                    </Box>
                  )}

                  {/* Company response */}
                  {oferta.comentarioEmpresa && (
                    <Box
                      sx={{
                        backgroundColor: "var(--color-bg-danger-secondary)",
                        borderRadius: 2,
                        p: 2,
                        border: "1px solid var(--color-border-danger-tertiary)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <ChatBubbleOutline sx={{ fontSize: 16, color: "var(--color-fg-danger-primary)" }} />
                        <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 600 }}>
                          Respuesta de la empresa
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "var(--color-fg-danger-primary)", fontStyle: "italic" }}>
                        "{oferta.comentarioEmpresa}"
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
    </CollapsibleSection>
  );
};

export default HistorialOfertasFactoring;
