import { Box, Button, Typography } from "@mui/material";
import { Delete, PieChart, Save, Send } from "@mui/icons-material";
import { formatMoney, formatPercent } from "../../utils/ofertaFormatters";

interface ResumenOfertaAsideProps {
  montoTotal: string | number;
  porcentajeFinanciamiento: string | number;
  montoAFinanciar: number;
  montoAGirar: number;
  tasa30Dias: string | number;
  diasFinanciamiento: string | number;
  vigenciaOfertaDias: string | number;
  submitDisabled: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  showDelete?: boolean;
  onDelete?: () => void;
  deleteDisabled?: boolean;
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
  montoAFinanciar,
  montoAGirar,
  tasa30Dias,
  diasFinanciamiento,
  vigenciaOfertaDias,
  submitDisabled,
  onCancel,
  submitLabel = "Enviar oferta",
  showDelete = false,
  onDelete,
  deleteDisabled = false,
}: ResumenOfertaAsideProps) => {
  const dias = Number(diasFinanciamiento) || 0;
  const vigencia = Number(vigenciaOfertaDias) || 0;
  const isSaveLabel = submitLabel.toLowerCase().includes("guardar");
  const rows = [
    { label: "Monto total de la factura", value: formatMoney(montoTotal) },
    {
      label: "Porcentaje a financiar",
      value: formatPercent(porcentajeFinanciamiento),
    },
    {
      label: "Monto a financiar",
      value: formatMoney(montoAFinanciar),
      emphasize: true,
    },
    { label: "Monto a girar", value: formatMoney(montoAGirar) },
    { label: "Tasa 30 días", value: formatPercent(tasa30Dias) },
    {
      label: "Días de financiamiento",
      value: `${dias} ${dias === 1 ? "día" : "días"}`,
    },
    {
      label: "Vigencia de la oferta",
      value: `${vigencia} ${vigencia === 1 ? "día" : "días"}`,
    },
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
        <PieChart
          sx={{ color: "var(--color-fg-accent-primary)", fontSize: 28 }}
        />
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
            Monto a girar {formatMoney(montoAGirar)}
          </Typography>
        </Box>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={isSaveLabel ? <Save /> : <Send />}
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
        {submitLabel}
      </Button>
      {showDelete && (
        <Button
          type="button"
          variant="outlined"
          fullWidth
          startIcon={<Delete />}
          onClick={onDelete}
          disabled={deleteDisabled}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1.25,
            borderRadius: 2,
            mb: 1.5,
            color: "var(--color-fg-danger-primary)",
            borderColor: "var(--color-border-danger-secondary)",
            "&:hover": {
              borderColor: "var(--color-border-danger-secondary)",
              backgroundColor: "var(--color-bg-danger-secondary)",
            },
          }}
        >
          Eliminar oferta
        </Button>
      )}
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
