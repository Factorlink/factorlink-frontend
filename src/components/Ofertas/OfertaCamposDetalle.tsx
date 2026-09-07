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

const CONDICIONES_FIELDS: FieldDef[] = [
  {
    key: "diasFinanciamiento",
    label: "Días de financiamiento",
    format: (v) => {
      const n = formatInteger(v);
      return n === "—" ? n : `${n} días`;
    },
  },
  {
    key: "fechaCotizacion",
    label: "Fecha de cotización",
    format: formatDateOnly,
  },
  { key: "tasa30Dias", label: "Tasa 30 días", format: formatPercent },
  {
    key: "tasaDiariaMora",
    label: "Tasa diaria de mora",
    format: formatPercent,
  },
  {
    key: "cobroPorDiaMora",
    label: "Cobro por día de mora",
    format: formatMoney,
  },
];

const MONTOS_FIELDS: FieldDef[] = [
  { key: "montoAFinanciar", label: "Monto a financiar", format: formatMoney },
  { key: "retencion", label: "Retención", format: formatMoney },
  {
    key: "costoFinanciamiento",
    label: "Costo de financiamiento",
    format: formatMoney,
  },
  { key: "precioCompra", label: "Precio de compra", format: formatMoney },
  { key: "saldoPendiente", label: "Saldo pendiente", format: formatMoney },
  { key: "montoComision", label: "Monto de comisión", format: formatMoney },
  { key: "ivaComision", label: "IVA comisión", format: formatMoney },
  {
    key: "gastosAdministrativos",
    label: "Gastos administrativos",
    format: formatMoney,
  },
  { key: "firmaDigital", label: "Firma digital", format: formatMoney },
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
  withTopBorder = true,
}: {
  title: string;
  fields: FieldDef[];
  oferta: Oferta;
  withTopBorder?: boolean;
}) => {
  if (!hasAnyInformed(oferta, fields)) return null;

  return (
    <Box
      sx={{
        pt: 2,
        ...(withTopBorder && {
          borderTop: "1px solid",
          borderColor: "divider",
        }),
      }}
    >
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
  const showMontos = hasAnyInformed(oferta, MONTOS_FIELDS);
  const showCondiciones = hasAnyInformed(oferta, CONDICIONES_FIELDS);

  if (!showMontos && !showCondiciones) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
      <Section
        title="Montos y condiciones"
        fields={MONTOS_FIELDS}
        oferta={oferta}
        withTopBorder={false}
      />
      <Section
        title="Condiciones adicionales"
        fields={CONDICIONES_FIELDS}
        oferta={oferta}
        withTopBorder={showMontos}
      />
    </Box>
  );
};

export default OfertaCamposDetalle;
