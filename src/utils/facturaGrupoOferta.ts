import type { Factura } from "../types/factura";
import type { Oferta } from "../types/oferta";
import {
  computeOfertaMontos,
  montoAGirarEsNegativo,
} from "./ofertaCalculations";
import { toFiniteNumber } from "./ofertaFormatters";
import type { OfertaPayloadInput } from "./ofertaPayload";

export type OfertaGrupoBorrador = OfertaPayloadInput;

/** Valores del formulario de oferta, compartidos por la oferta individual y la grupal. */
export type OfertaGrupoFormValues = {
  diasFinanciamiento: number | string;
  porcentajeFinanciamiento: number | string;
  fechaCotizacion: Date | null;
  tasa30Dias: number | string;
  montoComision: string | number;
  gastosAdministrativos: string | number;
  saldoPendiente: string | number;
  tasaDiariaMora: number | string;
  vigenciaOfertaDias: number | string;
  comentario: string;
  ofertaCondicionada: boolean;
};

export type OfertaGrupalPreviewRow = {
  facturaId: string;
  folio: string;
  montoTotal: number;
  montoAFinanciar: number;
  montoComision: number;
  montoAGirar: number;
};

export type FacturaGrupoOfertaDisplay = {
  kind: "sin_oferta" | "borrador" | "creada";
  label: string;
};

const normalizeEstado = (estado?: string | null) =>
  estado?.trim().toLowerCase() ?? "";

export const getFacturaOfertaEstadoRaw = (factura?: Factura | null) =>
  normalizeEstado(
    factura?.ofertaFactoring?.estado || factura?.factoringIsOfertme,
  );

export const hasOfertaGrupoBorrador = (
  borradores: Record<string, OfertaGrupoBorrador>,
  facturaId?: string | null,
) => Boolean(facturaId && borradores[facturaId]);

export const facturaTieneOfertaEnviada = (factura?: Factura | null) =>
  Boolean(factura?.ofertaFactoring);

export const grupoTieneOfertaEnviada = (facturas: Factura[]) =>
  facturas.some((factura) => facturaTieneOfertaEnviada(factura));

/** Borradores de facturas que aún no tienen oferta enviada. */
export const getBorradoresPendientesEnvio = (
  borradores: Record<string, OfertaGrupoBorrador>,
  facturas: Factura[] = [],
): OfertaGrupoBorrador[] => {
  const ofertadas = new Set(
    facturas
      .filter((factura) => facturaTieneOfertaEnviada(factura))
      .map((factura) => factura.id),
  );
  return Object.values(borradores).filter(
    (borrador) => !ofertadas.has(borrador.facturaId),
  );
};

export const canEnviarOfertaAlGrupo = (
  borradores: Record<string, OfertaGrupoBorrador>,
  facturas: Factura[] = [],
) => {
  const pendientes = getBorradoresPendientesEnvio(borradores, facturas);
  return (
    pendientes.length > 0 &&
    pendientes.every(
      (borrador) =>
        !montoAGirarEsNegativo(toFiniteNumber(borrador.montoAGirar) ?? 0),
    )
  );
};

export const buildOfertaGrupalInitialValues = (
  plazo?: number | null,
): OfertaGrupoFormValues => ({
  diasFinanciamiento: plazo || "",
  porcentajeFinanciamiento: 100,
  fechaCotizacion: new Date(),
  tasa30Dias: 0,
  montoComision: "",
  gastosAdministrativos: "",
  saldoPendiente: "0",
  tasaDiariaMora: 0,
  vigenciaOfertaDias: 3,
  comentario: "",
  ofertaCondicionada: false,
});

export const buildOfertaGrupoBorrador = (
  factura: Factura,
  factoringId: string,
  values: OfertaGrupoFormValues,
): OfertaGrupoBorrador | null => {
  if (!values.fechaCotizacion) return null;
  const montos = computeOfertaMontos({
    montoTotal: factura.montoTotal,
    porcentajeFinanciamiento: values.porcentajeFinanciamiento,
    diasFinanciamiento: values.diasFinanciamiento,
    tasa30Dias: values.tasa30Dias,
    saldoPendiente: values.saldoPendiente,
    montoComision: values.montoComision,
    gastosAdministrativos: values.gastosAdministrativos,
  });

  return {
    facturaId: factura.id,
    factoringId,
    diasFinanciamiento: values.diasFinanciamiento,
    porcentajeFinanciamiento: values.porcentajeFinanciamiento,
    fechaCotizacion: values.fechaCotizacion,
    montoAFinanciar: montos.montoAFinanciar,
    tasa30Dias: values.tasa30Dias,
    retencion: montos.retencion,
    costoFinanciamiento: montos.costoFinanciamiento,
    precioCompra: montos.precioCompra,
    saldoPendiente: values.saldoPendiente || "0",
    montoComision: values.montoComision,
    ivaComision: montos.ivaComision,
    gastosAdministrativos: values.gastosAdministrativos,
    montoAGirar: montos.montoAGirar,
    tasaDiariaMora: values.tasaDiariaMora,
    vigenciaOfertaDias: values.vigenciaOfertaDias,
    comentario: values.comentario,
    ofertaCondicionada: values.ofertaCondicionada,
  };
};

export const buildOfertaGrupalBorradores = (
  facturas: Factura[],
  factoringId: string,
  values: OfertaGrupoFormValues,
): OfertaGrupoBorrador[] | null => {
  const borradores: OfertaGrupoBorrador[] = [];
  for (const factura of facturas) {
    const borrador = buildOfertaGrupoBorrador(factura, factoringId, values);
    if (!borrador) return null;
    borradores.push(borrador);
  }
  return borradores;
};

export const buildOfertaGrupalPreview = (
  facturas: Factura[],
  values: Pick<
    OfertaGrupoFormValues,
    | "porcentajeFinanciamiento"
    | "diasFinanciamiento"
    | "tasa30Dias"
    | "saldoPendiente"
    | "montoComision"
    | "gastosAdministrativos"
  >,
): OfertaGrupalPreviewRow[] =>
  facturas.map((factura) => {
    const montos = computeOfertaMontos({
      montoTotal: factura.montoTotal,
      porcentajeFinanciamiento: values.porcentajeFinanciamiento,
      diasFinanciamiento: values.diasFinanciamiento,
      tasa30Dias: values.tasa30Dias,
      saldoPendiente: values.saldoPendiente,
      montoComision: values.montoComision,
      gastosAdministrativos: values.gastosAdministrativos,
    });

    return {
      facturaId: factura.id,
      folio: factura.folio,
      montoTotal: toFiniteNumber(factura.montoTotal) ?? 0,
      montoAFinanciar: montos.montoAFinanciar,
      montoComision: toFiniteNumber(values.montoComision) ?? 0,
      montoAGirar: montos.montoAGirar,
    };
  });

export const sumFacturasMontoTotal = (facturas: Factura[]) =>
  facturas.reduce(
    (sum, factura) => sum + (toFiniteNumber(factura.montoTotal) ?? 0),
    0,
  );

export const getFacturaGrupoOfertaDisplay = (
  factura?: Factura | null,
  hasBorradorLocal = false,
): FacturaGrupoOfertaDisplay => {
  if (facturaTieneOfertaEnviada(factura)) {
    return { kind: "creada", label: "Oferta creada" };
  }

  if (hasBorradorLocal) {
    return { kind: "borrador", label: "Borrador" };
  }

  const estado = getFacturaOfertaEstadoRaw(factura);

  if (!estado) {
    return { kind: "sin_oferta", label: "Sin oferta" };
  }

  if (estado === "borrador") {
    return { kind: "borrador", label: "Borrador" };
  }

  if (estado === "enviada") {
    return { kind: "creada", label: "Oferta creada" };
  }

  return { kind: "creada", label: "Oferta creada" };
};

export const aggregateGrupoHistoryOfertas = (
  facturas: Factura[],
): Oferta[] => {
  const byId = new Map<string, Oferta>();

  for (const factura of facturas) {
    for (const oferta of factura.historyOfertas ?? []) {
      if (!oferta?.id) continue;
      if (!byId.has(oferta.id)) {
        byId.set(oferta.id, oferta);
      }
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });
};
