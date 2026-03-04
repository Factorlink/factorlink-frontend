import { Box, Typography } from "@mui/material";
import { RequestQuote } from "@mui/icons-material";
import useAuthStore from "../../store/authStore";

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

  const { currentRole } = useAuthStore();

  const isEmpresa = currentRole?.contexto === "empresa";

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 3,
        p: 3,
        mb: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
          <RequestQuote sx={{ color: "#00BCD4", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
            {isEmpresa ? "Detalle de Cotización" : "Financiamiento Solicitado"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
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
        <Box sx={{ backgroundColor: "#F8FAFC", borderRadius: 2, p: 2 }}>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Plazo
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
            {plazo || 0} días
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: "#F8FAFC", borderRadius: 2, p: 2 }}>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Porcentaje de Financiamiento
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
            {porcentajeFinanciamiento || 0}%
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
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#00A86B" }}>
            {formatCurrency(montoFinanciar)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DetalleCotizacionCard;
