import type { CreateOfertaPayload } from "../types/oferta";
import { toDateOnlyString, toFiniteNumber } from "./ofertaFormatters";

export type OfertaPayloadInput = {
  facturaId: string;
  factoringId: string;
  porcentajeFinanciamiento: string | number;
  tasa: string | number;
  montoAdelanto: string | number;
  fechaExpiracion: string | Date;
  comentario?: string | null;
  ofertaCondicionada?: boolean;
  tipoDocumento: string | null;
  fechaOperacion: string | Date | null;
  numeroDocumentos: string | number | null;
  plazoPromedioPago: string | number | null;
  montoDocumentos: string | number | null;
  tasaComision: string | number | null;
  diferenciaPrecio: string | number | null;
  montoComision: string | number | null;
  retencion: string | number | null;
  notaria: string | number | null;
  gastosCobrados: string | number | null;
  iva: string | number | null;
  recuperacionGastos: string | number | null;
  recaudacion: string | number | null;
  excedentes: string | number | null;
  montoAGirar: string | number | null;
};

const toRequiredNumber = (
  value: string | number | null | undefined,
  field: string,
): number => {
  const n = toFiniteNumber(value);
  if (n === undefined) {
    throw new Error(`El campo ${field} es obligatorio y debe ser numérico`);
  }
  return n;
};

const toRequiredString = (
  value: string | null | undefined,
  field: string,
): string => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    throw new Error(`El campo ${field} es obligatorio`);
  }
  return trimmed;
};

const toIsoDateTime = (value: string | Date): string => {
  if (value instanceof Date) return value.toISOString();
  return value;
};

const REQUIRED_NUMERIC_KEYS = [
  "diferenciaPrecio",
  "montoComision",
  "gastosCobrados",
  "iva",
] as const;

const OPTIONAL_NUMERIC_KEYS = [
  "numeroDocumentos",
  "plazoPromedioPago",
  "montoDocumentos",
  "tasaComision",
  "retencion",
  "notaria",
  "recuperacionGastos",
  "recaudacion",
  "excedentes",
  "montoAGirar",
] as const;

export const buildCreateOfertaPayload = (
  input: OfertaPayloadInput,
): CreateOfertaPayload => {
  const requiredNumeric = Object.fromEntries(
    REQUIRED_NUMERIC_KEYS.map((key) => [
      key,
      toRequiredNumber(input[key], key),
    ]),
  ) as Pick<CreateOfertaPayload, (typeof REQUIRED_NUMERIC_KEYS)[number]>;

  const optionalNumeric: Partial<
    Pick<CreateOfertaPayload, (typeof OPTIONAL_NUMERIC_KEYS)[number]>
  > = {};
  for (const key of OPTIONAL_NUMERIC_KEYS) {
    const n = toFiniteNumber(input[key]);
    if (n !== undefined) {
      optionalNumeric[key] = n;
    }
  }

  const fechaOperacion = toDateOnlyString(input.fechaOperacion);

  return {
    facturaId: input.facturaId,
    factoringId: input.factoringId,
    porcentajeFinanciamiento: toRequiredNumber(
      input.porcentajeFinanciamiento,
      "porcentajeFinanciamiento",
    ),
    tasa: toRequiredNumber(input.tasa, "tasa"),
    montoAdelanto: toRequiredNumber(input.montoAdelanto, "montoAdelanto"),
    fechaExpiracion: toIsoDateTime(input.fechaExpiracion),
    comentario: input.comentario?.trim() ?? "",
    ofertaCondicionada: Boolean(input.ofertaCondicionada),
    tipoDocumento: toRequiredString(input.tipoDocumento, "tipoDocumento"),
    ...(fechaOperacion ? { fechaOperacion } : {}),
    ...requiredNumeric,
    ...optionalNumeric,
  };
};
