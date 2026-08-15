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
import { statsRowSx } from "../../theme/layoutStyles";
import SectionPanel from "../SectionPanel";

interface FacturaResumenCardProps {
  factura: Factura;
}

const getStatusConfig = (estado: string) => {
  switch (estado) {
    case "CARGADA":
      return {
        label: "CARGADA",
        color: "var(--color-fg-default-secondary)",
        bgColor: "var(--color-bg-default-tertiary)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "EN_MARKETPLACE":
      return {
        label: "EN MARKETPLACE",
        color: "var(--color-fg-accent-primary)",
        bgColor: "var(--color-bg-accent-secondary)",
        icon: <Business sx={{ fontSize: 14 }} />,
      };
    case "CON_OFERTAS":
      return {
        label: "CON OFERTAS",
        color: "var(--color-fg-success-primary)",
        bgColor: "var(--color-bg-success-secondary)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "CEDIDA":
      return {
        label: "CEDIDA",
        color: "var(--color-fg-success-primary)",
        bgColor: "var(--color-bg-success-secondary)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "EN_COBRANZA":
      return {
        label: "EN COBRANZA",
        color: "var(--color-fg-success-primary)",
        bgColor: "var(--color-bg-success-secondary)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "COBRADA":
      return {
        label: "COBRADA",
        color: "var(--color-fg-success-primary)",
        bgColor: "var(--color-bg-success-secondary)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "NO_COBRADA":
      return {
        label: "NO COBRADA",
        color: "var(--color-fg-success-primary)",
        bgColor: "var(--color-bg-success-secondary)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    default:
      return {
        label: estado || "N/A",
        color: "var(--color-fg-default-secondary)",
        bgColor: "var(--color-bg-default-tertiary)",
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
      <SectionPanel
        title="Información general del documento"
        icon={<Description sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />}
        action={
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
        }
      >
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
                color: "var(--color-fg-default-secondary)",
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
              sx={{ color: "var(--color-fg-accent-primary)", fontWeight: 700 }}
            >
              #{factura.folio}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-tertiary)" }}>
              SII ID: {factura.siiId || "N/A"}
            </Typography>
          </Box>

          {/* Emisor */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-fg-default-secondary)",
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
              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
            >
              {factura.razonSocialEmisor || "N/A"}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-tertiary)" }}>
              {factura.rutEmisor || ""}
            </Typography>
          </Box>

          {/* Receptor */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-fg-default-secondary)",
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
              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
            >
              {factura.razonSocialReceptor || "N/A"}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-tertiary)" }}>
              {factura.rutReceptor || ""}
            </Typography>
          </Box>

          {/* RUT Firmante */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-fg-default-secondary)",
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
              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
            >
              {factura.rutFirmante || "N/A"}
            </Typography>
          </Box>

          {/* Fecha Emisión */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-fg-default-secondary)",
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
              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
            >
              {formatDate(factura.fechaEmision)}
            </Typography>
          </Box>

          {/* Fecha Recepción */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-fg-default-secondary)",
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
              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
            >
              {formatDate(factura.fechaRecepcion)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={[
            statsRowSx,
            {
              mb: 0,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            },
          ]}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Monto total
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
            >
              {formatCurrency(factura.montoTotal)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Financiamiento solicitado
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
            >
              {factura.porcentajeFinanciamiento || 0}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "var(--color-fg-success-primary)" }}>
              Monto a financiar
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-success-primary)" }}
            >
              {formatCurrency(factura.montoFinanciar)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Plazo solicitado
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
            >
              {factura.plazo || 0} {factura.plazo === 1 ? "día" : "días"}
            </Typography>
          </Box>
        </Box>
      </SectionPanel>

      <SectionPanel title="Montos del documento">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-tertiary)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Monto Neto
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
            >
              {formatCurrency(factura.montoNeto)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-tertiary)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              IVA (19%)
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
            >
              {formatCurrency(factura.detalleIva)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-tertiary)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Descuento Global
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
            >
              {formatCurrency(factura.descuentoGlobal)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "var(--color-bg-success-secondary)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--color-fg-success-primary)" }}>
              Monto Total
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "var(--color-fg-success-primary)" }}
            >
              {formatCurrency(factura.montoTotal)}
            </Typography>
          </Box>
        </Box>
      </SectionPanel>
    </>
  );
};

export default FacturaResumenCard;
export { formatCurrency, formatDate, getStatusConfig };
