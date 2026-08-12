import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import {
  formatDateOnly,
  formatInteger,
  formatMoney,
  formatPercent,
  isInformed,
  type OptionalValue,
} from "../../utils/ofertaFormatters";

export type ConfirmarOfertaData = {
  porcentajeFinanciamiento: OptionalValue;
  montoAdelanto: OptionalValue;
  tasa: OptionalValue;
  plazo: number;
  fechaExpiracion: OptionalValue;
  tipoDocumento: OptionalValue;
  fechaOperacion: OptionalValue;
  numeroDocumentos: OptionalValue;
  plazoPromedioPago: OptionalValue;
  montoDocumentos: OptionalValue;
  tasaComision: OptionalValue;
  diferenciaPrecio: OptionalValue;
  montoComision: OptionalValue;
  retencion: OptionalValue;
  notaria: OptionalValue;
  gastosCobrados: OptionalValue;
  iva: OptionalValue;
  recuperacionGastos: OptionalValue;
  recaudacion: OptionalValue;
  excedentes: OptionalValue;
  montoAGirar: OptionalValue;
  comentario?: string | null;
};

interface ConfirmarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: ConfirmarOfertaData;
}

type SummaryRow = {
  label: string;
  value: string;
  emphasize?: boolean;
};

const SummarySection = ({
  title,
  rows,
}: {
  title?: string;
  rows: SummaryRow[];
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
    {title && (
      <Typography
        variant="caption"
        sx={{
          color: "var(--color-fg-default-secondary)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          mb: 0.25,
        }}
      >
        {title}
      </Typography>
    )}
    {rows.map((row) => (
      <Box
        key={row.label}
        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {row.label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: row.emphasize ? "primary.main" : "text.primary",
            textAlign: "right",
          }}
        >
          {row.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

const ConfirmarOfertaModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  data,
}: ConfirmarOfertaModalProps) => {
  const financiamientoRows: SummaryRow[] = [
    {
      label: "Financiamiento",
      value: formatPercent(data.porcentajeFinanciamiento),
    },
    {
      label: "Monto adelanto",
      value: formatMoney(data.montoAdelanto),
      emphasize: true,
    },
    { label: "Tasa", value: formatPercent(data.tasa) },
    { label: "Plazo factura", value: `${data.plazo} días` },
    {
      label: "Fecha de expiración",
      value: formatDateOnly(data.fechaExpiracion),
    },
  ];

  const operacionRows: SummaryRow[] = [
    {
      label: "Tipo de documento",
      value: isInformed(data.tipoDocumento)
        ? String(data.tipoDocumento)
        : "—",
    },
    {
      label: "Fecha de operación",
      value: formatDateOnly(data.fechaOperacion),
    },
    {
      label: "Número de documentos",
      value: formatInteger(data.numeroDocumentos),
    },
    {
      label: "Plazo promedio de pago",
      value: (() => {
        const n = formatInteger(data.plazoPromedioPago);
        return n === "—" ? n : `${n} días`;
      })(),
    },
  ];

  const montosRows: SummaryRow[] = [
    { label: "Monto de documentos", value: formatMoney(data.montoDocumentos) },
    { label: "Tasa de comisión", value: formatPercent(data.tasaComision) },
    { label: "Diferencia de precio", value: formatMoney(data.diferenciaPrecio) },
    { label: "Monto de comisión", value: formatMoney(data.montoComision) },
    { label: "Retención", value: formatMoney(data.retencion) },
    { label: "Notaría", value: formatMoney(data.notaria) },
    { label: "Gastos cobrados", value: formatMoney(data.gastosCobrados) },
    { label: "IVA", value: formatMoney(data.iva) },
    {
      label: "Recuperación de gastos",
      value: formatMoney(data.recuperacionGastos),
    },
    { label: "Recaudación", value: formatMoney(data.recaudacion) },
    { label: "Excedentes", value: formatMoney(data.excedentes) },
    {
      label: "Monto a girar",
      value: formatMoney(data.montoAGirar),
      emphasize: true,
    },
  ];

  const comentario = data.comentario?.trim();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-l)",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1, flexShrink: 0 }}>
        <Typography variant="h6" fontWeight={600}>
          ¿Confirmar envío de oferta?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Estás por enviar la siguiente oferta:
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2, overflowY: "auto", flex: 1, minHeight: 0 }}>
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-tertiary)",
            borderRadius: "var(--radius-m)",
            p: 2.5,
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <SummarySection
            title="Condiciones de financiamiento"
            rows={financiamientoRows}
          />
          <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />
          <SummarySection
            title="Información de la operación"
            rows={operacionRows}
          />
          <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />
          <SummarySection title="Montos y condiciones" rows={montosRows} />
          {comentario && (
            <>
              <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--color-fg-default-secondary)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  Comentario
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "text.primary", mt: 0.75 }}
                >
                  {comentario}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 3,
          pt: 1.5,
          flexShrink: 0,
        }}
      >
        <Warning sx={{ color: "var(--color-fg-warning-primary)", fontSize: 20 }} />
        <Typography
          variant="body2"
          sx={{ color: "var(--color-fg-warning-primary)", fontWeight: 500 }}
        >
          Una vez enviada, no podrás modificar ni reenviar esta oferta.
        </Typography>
      </Box>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 2, justifyContent: "center", flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: "var(--radius-m)",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: "var(--radius-m)",
            textTransform: "none",
            fontWeight: 600,
            color: "white",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirmar envío"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmarOfertaModal;
