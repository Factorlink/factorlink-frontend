import { toFiniteNumber } from "./ofertaFormatters";

export type OfertaMontosInput = {
  montoDocumentos: string | number | null | undefined;
  porcentajeFinanciamiento: string | number | null | undefined;
  tasa: string | number | null | undefined;
  plazoPromedioPago: string | number | null | undefined;
  montoComision: string | number | null | undefined;
  gastosCobrados: string | number | null | undefined;
};

export type OfertaMontosCalculados = {
  anticipoBruto: number;
  diferenciaPrecio: number;
  iva: number;
  montoAGirar: number;
};

const toNum = (value: string | number | null | undefined): number =>
  toFiniteNumber(value) ?? 0;

export const calcAnticipoBruto = (
  montoDocumentos: number,
  porcentajeFinanciamiento: number,
): number =>
  Math.round((montoDocumentos / 100) * porcentajeFinanciamiento);

export const calcDiferenciaPrecio = (
  tasa: number,
  plazoPromedioPago: number,
  montoDocumentos: number,
): number =>
  Math.round((tasa / 30 * plazoPromedioPago) * (montoDocumentos / 100));

export const calcIva = (
  montoComision: number,
  gastosCobrados: number,
): number => {
  const base = montoComision + gastosCobrados;
  return Math.round(base * 1.19 - base);
};

export const calcMontoAGirar = (
  anticipoBruto: number,
  diferenciaPrecio: number,
  montoComision: number,
  gastosCobrados: number,
  iva: number,
): number =>
  anticipoBruto - diferenciaPrecio - montoComision - gastosCobrados - iva;

export const computeOfertaMontos = (
  input: OfertaMontosInput,
): OfertaMontosCalculados => {
  const montoDocumentos = toNum(input.montoDocumentos);
  const porcentajeFinanciamiento = toNum(input.porcentajeFinanciamiento);
  const tasa = toNum(input.tasa);
  const plazoPromedioPago = toNum(input.plazoPromedioPago);
  const montoComision = toNum(input.montoComision);
  const gastosCobrados = toNum(input.gastosCobrados);

  const anticipoBruto = calcAnticipoBruto(
    montoDocumentos,
    porcentajeFinanciamiento,
  );
  const diferenciaPrecio = calcDiferenciaPrecio(
    tasa,
    plazoPromedioPago,
    montoDocumentos,
  );
  const iva = calcIva(montoComision, gastosCobrados);
  const montoAGirar = calcMontoAGirar(
    anticipoBruto,
    diferenciaPrecio,
    montoComision,
    gastosCobrados,
    iva,
  );

  return { anticipoBruto, diferenciaPrecio, iva, montoAGirar };
};
