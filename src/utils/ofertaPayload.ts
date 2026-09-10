import type { CreateOfertaPayload } from "../types/oferta";
import { toDateOnlyString, toFiniteNumber } from "./ofertaFormatters";

export type OfertaPayloadInput = {
  facturaId: string;
  factoringId: string;
  diasFinanciamiento: string | number;
  porcentajeFinanciamiento: string | number;
  fechaCotizacion: string | Date;
  montoAFinanciar: string | number;
  tasa30Dias: string | number;
  retencion: string | number;
  costoFinanciamiento: string | number;
  precioCompra: string | number;
  saldoPendiente: string | number;
  montoComision: string | number;
  ivaComision: string | number;
  gastosAdministrativos: string | number;
  firmaDigital: string | number;
  montoAGirar: string | number;
  tasaDiariaMora: string | number;
  cobroPorDiaMora: string | number;
  vigenciaOfertaDias: string | number;
  comentario?: string | null;
  ofertaCondicionada?: boolean;
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

const toRequiredDateOnly = (
  value: string | Date | null | undefined,
  field: string,
): string => {
  const dateOnly = toDateOnlyString(value);
  if (!dateOnly) {
    throw new Error(`El campo ${field} es obligatorio y debe ser una fecha`);
  }
  return dateOnly;
};

const REQUIRED_NUMERIC_KEYS = [
  "diasFinanciamiento",
  "porcentajeFinanciamiento",
  "montoAFinanciar",
  "tasa30Dias",
  "retencion",
  "costoFinanciamiento",
  "precioCompra",
  "saldoPendiente",
  "montoComision",
  "ivaComision",
  "gastosAdministrativos",
  "firmaDigital",
  "montoAGirar",
  "tasaDiariaMora",
  "cobroPorDiaMora",
  "vigenciaOfertaDias",
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

  return {
    facturaId: input.facturaId,
    factoringId: input.factoringId,
    fechaCotizacion: toRequiredDateOnly(input.fechaCotizacion, "fechaCotizacion"),
    comentario: input.comentario?.trim() ?? "",
    ofertaCondicionada: Boolean(input.ofertaCondicionada),
    ...requiredNumeric,
  };
};
