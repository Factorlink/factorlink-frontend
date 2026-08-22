import type { Oferta } from "../types/oferta";

/** Refleja OfertaEstado del backend (src/ofertas/entities/oferta.entity.ts). */
export const OFERTA_ESTADOS = {
  ACTIVA: "activa",
  INACTIVA: "inactiva",
  ACEPTADA: "aceptada",
  RECHAZADA: "rechazada",
  EXPIRADA: "expirada",
} as const;

export type OfertaEstado = (typeof OFERTA_ESTADOS)[keyof typeof OFERTA_ESTADOS];

type OfertaEstadoInput = Pick<Oferta, "estado"> &
  Partial<Pick<Oferta, "ofertaCondicionada">>;

export const normalizeOfertaEstado = (estado?: string | null): string =>
  estado?.trim().toLowerCase() ?? "";

export const isOfertaActiva = (oferta: OfertaEstadoInput): boolean =>
  normalizeOfertaEstado(oferta.estado) === OFERTA_ESTADOS.ACTIVA;

export const isOfertaCondicionada = (oferta: OfertaEstadoInput): boolean =>
  oferta.ofertaCondicionada === true;

export const puedeComentar = (oferta: OfertaEstadoInput): boolean =>
  isOfertaActiva(oferta);

export const puedeCancelar = (oferta: OfertaEstadoInput): boolean =>
  isOfertaActiva(oferta);

export const puedeEnviarOfertaFinal = (oferta: OfertaEstadoInput): boolean =>
  isOfertaActiva(oferta) && isOfertaCondicionada(oferta);
