import { Box, Button, Typography } from "@mui/material";
import { PieChart, Send } from "@mui/icons-material";
import {
  formatDateOnly,
  formatMoney,
  formatPercent,
} from "../../utils/ofertaFormatters";

interface ResumenOfertaAsideProps {
  montoTotal: string | number;
  porcentajeFinanciamiento: string | number;
  montoFinanciar: string | number;
  montoAdelanto: number;
  tasa: string | number;
  plazo: number;
  fechaExpiracion: Date | null;
  submitDisabled: boolean;
  onCancel?: () => void;
}

const rowSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 2,
};

const labelSx = {
  color: "var(--color-fg-default-secondary)",
  fontSize: "0.875rem",
};

const valueSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-primary)",
  textAlign: "right" as const,
};

const ResumenOfertaAside = ({
  montoTotal,
  porcentajeFinanciamiento,
  montoFinanciar,
  montoAdelanto,
  tasa,
  plazo,
  fechaExpiracion,
  submitDisabled,
  onCancel,
}: ResumenOfertaAsideProps) => {
  const rows = [
    { label: "Monto total de la factura", value: formatMoney(montoTotal) },
    {
      label: "Porcentaje a financiar",
      value: formatPercent(porcentajeFinanciamiento),
    },
    {
      label: "Monto a financiar",
      value: formatMoney(montoFinanciar),
      emphasize: true,
    },
    { label: "Monto adelanto", value: formatMoney(montoAdelanto) },
    { label: "Tasa aplicada", value: formatPercent(tasa) },
    {
      label: "Plazo de la oferta",
      value: `${plazo || 0} ${plazo === 1 ? "día" : "días"}`,
    },
    { label: "Fecha de expiración", value: formatDateOnly(fechaExpiracion) },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        boxShadow: "var(--shadow-popover)",
        p: 3,
        position: { lg: "sticky" },
        top: { lg: 24 },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "text.primary", mb: 2.5 }}
      >
        Resumen de tu oferta
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2.5 }}>
        {rows.map((row) => (
          <Box key={row.label} sx={rowSx}>
            <Typography sx={labelSx}>{row.label}</Typography>
            <Typography
              sx={{
                ...valueSx,
                ...(row.emphasize
                  ? { color: "var(--color-fg-success-primary)" }
                  : {}),
              }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "var(--color-bg-accent-secondary)",
        }}
      >
        <PieChart sx={{ color: "var(--color-fg-accent-primary)", fontSize: 28 }} />
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "var(--color-fg-accent-primary)" }}
          >
            Financiamiento {formatPercent(porcentajeFinanciamiento)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Monto a financiar {formatMoney(montoFinanciar)}
          </Typography>
        </Box>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={<Send />}
        disabled={submitDisabled}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          color: "var(--color-fg-on-accent-primary)",
          py: 1.25,
          borderRadius: 2,
          mb: 1.5,
        }}
      >
        Enviar oferta
      </Button>
      <Button
        type="button"
        variant="outlined"
        fullWidth
        onClick={onCancel}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          py: 1.25,
          borderRadius: 2,
        }}
      >
        Cancelar
      </Button>
    </Box>
  );
};

export default ResumenOfertaAside;
