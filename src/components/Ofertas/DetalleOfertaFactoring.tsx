import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Send,
  AccessTime,
  Percent,
  AccountBalance,
  CalendarToday,
} from "@mui/icons-material";
import type { Oferta } from "../../types/oferta";

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
      return { label: "Aceptada", color: "#10B981", bg: "#ECFDF5" };
    case "rechazada":
      return { label: "Rechazada", color: "#EF4444", bg: "#FEF2F2" };
    case "expirada":
      return { label: "Expirada", color: "#F59E0B", bg: "#FFFBEB" };
    case "activa":
      return { label: "Activa", color: "#00BCD4", bg: "#E0F7FA" };
    default:
      return { label: estado, color: "#00BCD4", bg: "#E0F7FA" };
  }
};

interface DetalleOfertaFactoringProps {
  oferta: Oferta;
  plazo: number;
}

const DetalleOfertaFactoring = ({ oferta, plazo }: DetalleOfertaFactoringProps) => {
  const estadoConfig = getEstadoConfig(oferta.estado);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Send sx={{ color: "primary.main", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          Estado de tu oferta
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Info banner */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#E0F7FA",
            mb: 3,
          }}
        >
          <AccessTime sx={{ color: "#00BCD4", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "#00838F" }}>
            Tu oferta está en revisión por la empresa emisora.
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
          }}
        >
          {/* Title + Badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Tu oferta
            </Typography>
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
                <Percent sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Financiamiento
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {oferta.porcentajeFinanciamiento}%
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <Percent sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Tasa
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {oferta.tasa}%
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <AccountBalance sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Monto adelanto
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                {formatCurrency(oferta.montoAdelanto)}
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <AccessTime sx={{ fontSize: 16, color: "#64748B" }} />
                <Typography variant="caption" sx={{ color: "#64748B" }}>
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
              mb: oferta.comentario ? 3 : 0,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Enviada: {formatDate(oferta.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: "#94A3B8" }} />
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Expira: {formatDateShort(oferta.fechaExpiracion)}
              </Typography>
            </Box>
          </Box>

          {/* Comment */}
          {oferta.comentario && (
            <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Comentario:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {oferta.comentario}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetalleOfertaFactoring;
