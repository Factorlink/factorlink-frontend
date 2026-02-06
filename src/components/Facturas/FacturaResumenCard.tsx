import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Description,
  Business,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import type { Factura } from "../../types/factura";

interface FacturaResumenCardProps {
  factura: Factura;
}

const getStatusConfig = (estado: string) => {
  switch (estado) {
    case "CARGADA":
      return {
        label: "CARGADA",
        color: "#64748B",
        bgColor: "#F1F5F9",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "EN_MARKETPLACE":
      return {
        label: "EN MARKETPLACE",
        color: "#00BCD4",
        bgColor: "rgba(0, 188, 212, 0.1)",
        icon: <Business sx={{ fontSize: 14 }} />,
      };
    case "CON_OFERTAS":
      return {
        label: "CON OFERTAS",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "CEDIDA":
      return {
        label: "CEDIDA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "EN_COBRANZA":
      return {
        label: "EN COBRANZA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "COBRADA":
      return {
        label: "COBRADA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "NO_COBRADA":
      return {
        label: "NO COBRADA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    default:
      return {
        label: estado || "N/A",
        color: "#64748B",
        bgColor: "#F1F5F9",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
  }
};

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const FacturaResumenCard = ({ factura }: FacturaResumenCardProps) => {
  const statusConfig = getStatusConfig(factura.estado);

  return (
    <>
      {/* Card 1: Datos de la Factura */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                backgroundColor: "#F1F5F9",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Description sx={{ color: "#00BCD4", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                Datos de la Factura
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Información general del documento
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            sx={{
              backgroundColor: statusConfig.bgColor,
              color: statusConfig.color,
              fontWeight: 600,
              "& .MuiChip-icon": { color: statusConfig.color },
            }}
          />
        </Box>

        {/* Datos Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Folio */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              # Folio
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#00BCD4", fontWeight: 700 }}
            >
              #{factura.folio}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              SII ID: {factura.siiId || "N/A"}
            </Typography>
          </Box>

          {/* Emisor */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Business sx={{ fontSize: 14 }} /> Emisor
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#1E293B" }}
            >
              {factura.razonSocialEmisor || "N/A"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              {factura.rutEmisor || ""}
            </Typography>
          </Box>

          {/* Receptor */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Business sx={{ fontSize: 14 }} /> Receptor
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#1E293B" }}
            >
              {factura.razonSocialReceptor || "N/A"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              {factura.rutReceptor || ""}
            </Typography>
          </Box>

          {/* RUT Firmante */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Person sx={{ fontSize: 14 }} /> RUT Firmante
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#1E293B" }}
            >
              {factura.rutFirmante || "N/A"}
            </Typography>
          </Box>

          {/* Fecha Emisión */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <CalendarToday sx={{ fontSize: 14 }} /> Fecha de Emisión
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#1E293B" }}
            >
              {formatDate(factura.fechaEmision)}
            </Typography>
          </Box>

          {/* Fecha Recepción */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <CalendarToday sx={{ fontSize: 14 }} /> Fecha de Recepción
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#1E293B" }}
            >
              {formatDate(factura.fechaRecepcion)}
            </Typography>
          </Box>
        </Box>

        {/* Plazo */}
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#64748B", mb: 0.5, display: "block" }}
          >
            Plazo
          </Typography>
          <Chip
            label={`${factura.plazo || 0} días`}
            size="small"
            sx={{
              backgroundColor: "#F1F5F9",
              color: "#475569",
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Card 2: Detalle de Montos */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#1E293B", mb: 2 }}
        >
          Detalle de Montos
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(5, 1fr)" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#F8FAFC",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Monto Neto
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1E293B" }}
            >
              {formatCurrency(factura.montoNeto)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F8FAFC",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              IVA (19%)
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1E293B" }}
            >
              {formatCurrency(factura.detalleIva)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F8FAFC",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Descuento Global
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1E293B" }}
            >
              {formatCurrency(factura.descuentoGlobal)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(0, 168, 107, 0.2)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#00A86B" }}>
              Monto Total
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#00A86B" }}
            >
              {formatCurrency(factura.montoTotal)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(0, 168, 107, 0.2)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#00A86B" }}>
              Monto a Financiar
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#00A86B" }}
            >
              {formatCurrency(factura.montoFinanciar)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FacturaResumenCard;
export { formatCurrency, formatDate, getStatusConfig };
