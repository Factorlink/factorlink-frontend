import { toFiniteNumber } from "./ofertaFormatters";

export type OfertaMontosInput = {
  montoTotal: string | number | null | undefined;
  porcentajeFinanciamiento: string | number | null | undefined;
  diasFinanciamiento: string | number | null | undefined;
  tasa30Dias: string | number | null | undefined;
  saldoPendiente: string | number | null | undefined;
  montoComision: string | number | null | undefined;
  gastosAdministrativos: string | number | null | undefined;
  firmaDigital: string | number | null | undefined;
};

export type OfertaMontosCalculados = {
  ivaComision: number;
  montoAFinanciar: number;
  retencion: number;
  costoFinanciamiento: number;
  precioCompra: number;
  montoAGirar: number;
};

const toNum = (value: string | number | null | undefined): number =>
  toFiniteNumber(value) ?? 0;

export const calcIvaComision = (montoComision: number): number =>
  Math.round(montoComision * 1.19 - montoComision);

export const calcMontoAFinanciar = (
  montoTotal: number,
  porcentajeFinanciamiento: number,
): number => Math.round(montoTotal * (porcentajeFinanciamiento / 100));

export const calcRetencion = (
  montoTotal: number,
  montoAFinanciar: number,
): number => Math.round(montoTotal - montoAFinanciar);

/** tasa30Dias en puntos porcentuales (ej. 1.4); se aplica /100 como en el modelo previo. */
export const calcCostoFinanciamiento = (
  diasFinanciamiento: number,
  tasa30Dias: number,
  montoAFinanciar: number,
): number =>
  Math.round(
    ((diasFinanciamiento / 30) * tasa30Dias) * (montoAFinanciar / 100),
  );

export const calcPrecioCompra = (
  montoAFinanciar: number,
  costoFinanciamiento: number,
): number => Math.round(montoAFinanciar - costoFinanciamiento);

export const calcMontoAGirar = (
  precioCompra: number,
  saldoPendiente: number,
  montoComision: number,
  ivaComision: number,
  gastosAdministrativos: number,
  firmaDigital: number,
): number =>
  Math.round(
    precioCompra -
      saldoPendiente -
      montoComision -
      ivaComision -
      gastosAdministrativos -
      firmaDigital,
  );

export const computeOfertaMontos = (
  input: OfertaMontosInput,
): OfertaMontosCalculados => {
  const montoTotal = toNum(input.montoTotal);
  const porcentajeFinanciamiento = toNum(input.porcentajeFinanciamiento);
  const diasFinanciamiento = toNum(input.diasFinanciamiento);
  const tasa30Dias = toNum(input.tasa30Dias);
  const saldoPendiente = toNum(input.saldoPendiente);
  const montoComision = toNum(input.montoComision);
  const gastosAdministrativos = toNum(input.gastosAdministrativos);
  const firmaDigital = toNum(input.firmaDigital);

  const ivaComision = calcIvaComision(montoComision);
  const montoAFinanciar = calcMontoAFinanciar(
    montoTotal,
    porcentajeFinanciamiento,
  );
  const retencion = calcRetencion(montoTotal, montoAFinanciar);
  const costoFinanciamiento = calcCostoFinanciamiento(
    diasFinanciamiento,
    tasa30Dias,
    montoAFinanciar,
  );
  const precioCompra = calcPrecioCompra(montoAFinanciar, costoFinanciamiento);
  const montoAGirar = calcMontoAGirar(
    precioCompra,
    saldoPendiente,
    montoComision,
    ivaComision,
    gastosAdministrativos,
    firmaDigital,
  );

  return {
    ivaComision,
    montoAFinanciar,
    retencion,
    costoFinanciamiento,
    precioCompra,
    montoAGirar,
  };
};
