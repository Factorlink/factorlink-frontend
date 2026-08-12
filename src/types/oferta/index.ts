import type { Factoring } from "../factoring";

/** API histórica manda strings; la nueva puede mandar number o null. */
export type OfertaNumericValue = string | number | null;

/** Campos operacionales y financieros. Required en create; parciales en PATCH. */
export type OfertaCamposOperacionales = {
    tipoDocumento: string;
    fechaOperacion: string;
    numeroDocumentos: number;
    plazoPromedioPago: number;
    montoDocumentos: number;
    tasaComision: number;
    diferenciaPrecio: number;
    montoComision: number;
    retencion: number;
    notaria: number;
    gastosCobrados: number;
    iva: number;
    recuperacionGastos: number;
    recaudacion: number;
    excedentes: number;
    montoAGirar: number;
};

export interface Oferta {
    id: string;
    comentario: string;
    comentarioEmpresa: string;
    createdAt: string;
    estado: string;
    factoringId: string;
    facturaId: string;
    fechaExpiracion: string;
    montoAdelanto: string;
    porcentajeFinanciamiento: string;
    tasa: string;
    factoring?: Factoring;
    tipoDocumento?: string | null;
    fechaOperacion?: string | null;
    numeroDocumentos?: OfertaNumericValue;
    plazoPromedioPago?: OfertaNumericValue;
    montoDocumentos?: OfertaNumericValue;
    tasaComision?: OfertaNumericValue;
    diferenciaPrecio?: OfertaNumericValue;
    montoComision?: OfertaNumericValue;
    retencion?: OfertaNumericValue;
    notaria?: OfertaNumericValue;
    gastosCobrados?: OfertaNumericValue;
    iva?: OfertaNumericValue;
    recuperacionGastos?: OfertaNumericValue;
    recaudacion?: OfertaNumericValue;
    excedentes?: OfertaNumericValue;
    montoAGirar?: OfertaNumericValue;
}

export type CreateOfertaPayload = {
    facturaId: string;
    factoringId: string;
    porcentajeFinanciamiento: number;
    tasa: number;
    montoAdelanto: number;
    fechaExpiracion: string;
    comentario: string;
} & OfertaCamposOperacionales;

export type UpdateOfertaPayload = {
    porcentajeFinanciamiento?: number;
    tasa?: number;
    montoAdelanto?: number;
    fechaExpiracion?: string;
    comentario?: string;
} & Partial<OfertaCamposOperacionales>;
