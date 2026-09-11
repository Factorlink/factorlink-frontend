import type { Factura } from "../types/factura";
import type { Oferta } from "../types/oferta";
import type { OfertaPayloadInput } from "./ofertaPayload";

export type OfertaGrupoBorrador = OfertaPayloadInput;

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

export const grupoTieneOfertaEnviada = (facturas: Factura[]) =>
  facturas.some((factura) => Boolean(factura.ofertaFactoring));

export const canEnviarOfertaAlGrupo = (
  borradores: Record<string, OfertaGrupoBorrador>,
  facturas: Factura[] = [],
) =>
  Object.keys(borradores).length > 0 && !grupoTieneOfertaEnviada(facturas);

export const getFacturaGrupoOfertaDisplay = (
  factura?: Factura | null,
  hasBorradorLocal = false,
): FacturaGrupoOfertaDisplay => {
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
