import { Box, Typography } from "@mui/material";
import type { Oferta } from "../../types/oferta";
import {
  formatDateOnly,
  formatInteger,
  formatMoney,
  formatPercent,
  isInformed,
  type OptionalValue,
} from "../../utils/ofertaFormatters";

type FieldDef = {
  key: keyof Oferta;
  label: string;
  format: (value: OptionalValue) => string;
  emphasize?: boolean;
};

const OPERACION_FIELDS: FieldDef[] = [
  {
    key: "tipoDocumento",
    label: "Tipo de documento",
    format: (v) => (isInformed(v) ? String(v) : "—"),
  },
  { key: "fechaOperacion", label: "Fecha de operación", format: formatDateOnly },
  {
    key: "numeroDocumentos",
    label: "Número de documentos",
    format: formatInteger,
  },
  {
    key: "plazoPromedioPago",
    label: "Plazo promedio de pago",
    format: (v) => {
      const n = formatInteger(v);
      return n === "—" ? n : `${n} días`;
    },
  },
];

const MONTOS_FIELDS: FieldDef[] = [
  { key: "montoDocumentos", label: "Monto de documentos", format: formatMoney },
  { key: "tasaComision", label: "Tasa de comisión", format: formatPercent },
  { key: "diferenciaPrecio", label: "Diferencia de precio", format: formatMoney },
  { key: "montoComision", label: "Monto de comisión", format: formatMoney },
  { key: "retencion", label: "Retención", format: formatMoney },
  { key: "notaria", label: "Notaría", format: formatMoney },
  { key: "gastosCobrados", label: "Gastos cobrados", format: formatMoney },
  { key: "iva", label: "IVA", format: formatMoney },
  {
    key: "recuperacionGastos",
    label: "Recuperación de gastos",
    format: formatMoney,
  },
  { key: "recaudacion", label: "Recaudación", format: formatMoney },
  { key: "excedentes", label: "Excedentes", format: formatMoney },
  {
    key: "montoAGirar",
    label: "Monto a girar",
    format: formatMoney,
    emphasize: true,
  },
];

const hasAnyInformed = (oferta: Oferta, fields: FieldDef[]) =>
  fields.some((field) => isInformed(oferta[field.key] as OptionalValue));

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    md: "repeat(4, minmax(0, 1fr))",
  },
  gap: 3,
};

interface OfertaCamposDetalleProps {
  oferta: Oferta;
}

const FieldCell = ({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) => (
  <Box>
    <Typography
      variant="caption"
      sx={{ color: "var(--color-fg-default-secondary)", display: "block", mb: 0.5 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontWeight: 600,
        color: emphasize ? "primary.main" : "var(--color-fg-default-primary)",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const Section = ({
  title,
  fields,
  oferta,
}: {
  title: string;
  fields: FieldDef[];
  oferta: Oferta;
}) => {
  if (!hasAnyInformed(oferta, fields)) return null;

  return (
    <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
      >
        {title}
      </Typography>
      <Box sx={gridSx}>
        {fields.map((field) => (
          <FieldCell
            key={field.key}
            label={field.label}
            value={field.format(oferta[field.key] as OptionalValue)}
            emphasize={field.emphasize}
          />
        ))}
      </Box>
    </Box>
  );
};

const OfertaCamposDetalle = ({ oferta }: OfertaCamposDetalleProps) => {
  const showOperacion = hasAnyInformed(oferta, OPERACION_FIELDS);
  const showMontos = hasAnyInformed(oferta, MONTOS_FIELDS);

  if (!showOperacion && !showMontos) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
      <Section
        title="Información de la operación"
        fields={OPERACION_FIELDS}
        oferta={oferta}
      />
      <Section
        title="Montos y condiciones"
        fields={MONTOS_FIELDS}
        oferta={oferta}
      />
    </Box>
  );
};

export default OfertaCamposDetalle;
