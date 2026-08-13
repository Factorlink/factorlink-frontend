import { Box, Typography } from "@mui/material";
import { RequestQuote } from "@mui/icons-material";

interface DetalleCotizacionCardProps {
  plazo: number;
  porcentajeFinanciamiento: string | number;
  montoFinanciar: string | number;
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const DetalleCotizacionCard = ({
  plazo,
  porcentajeFinanciamiento,
  montoFinanciar,
}: DetalleCotizacionCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        p: 3,
        mb: 3,
        boxShadow: "var(--shadow-popover)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-tertiary)",
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RequestQuote sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
            Información de cotización solicitada
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Condiciones de financiamiento de la factura
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Box sx={{ backgroundColor: "var(--color-bg-default-tertiary)", borderRadius: 2, p: 2 }}>
          <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Plazo
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}>
            {plazo || 0} días
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: "var(--color-bg-default-tertiary)", borderRadius: 2, p: 2 }}>
          <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Porcentaje de Financiamiento
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}>
            {porcentajeFinanciamiento || 0}%
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
            Monto a Financiar
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--color-fg-success-primary)" }}>
            {formatCurrency(montoFinanciar)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DetalleCotizacionCard;
