import type { Factoring } from "../factoring";

/** API histórica manda strings; la nueva puede mandar number o null. */
export type OfertaNumericValue = string | number | null;

/** Campos financieros del nuevo contrato de oferta. */
export type OfertaCamposFinancieros = {
    diasFinanciamiento: number;
    fechaCotizacion: string;
    montoAFinanciar: number;
    tasa30Dias: number;
    retencion: number;
    costoFinanciamiento: number;
    precioCompra: number;
    saldoPendiente: number;
    montoComision: number;
    ivaComision: number;
    gastosAdministrativos: number;
    firmaDigital: number;
    montoAGirar: number;
    tasaDiariaMora: number;
    cobroPorDiaMora: number;
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
    porcentajeFinanciamiento: string;
    factoring?: Factoring;
    ofertaCondicionada?: boolean;
    diasFinanciamiento?: OfertaNumericValue;
    fechaCotizacion?: string | null;
    montoAFinanciar?: OfertaNumericValue;
    tasa30Dias?: OfertaNumericValue;
    retencion?: OfertaNumericValue;
    costoFinanciamiento?: OfertaNumericValue;
    precioCompra?: OfertaNumericValue;
    saldoPendiente?: OfertaNumericValue;
    montoComision?: OfertaNumericValue;
    ivaComision?: OfertaNumericValue;
    gastosAdministrativos?: OfertaNumericValue;
    firmaDigital?: OfertaNumericValue;
    montoAGirar?: OfertaNumericValue;
    tasaDiariaMora?: OfertaNumericValue;
    cobroPorDiaMora?: OfertaNumericValue;
}

export type CreateOfertaPayload = {
    facturaId: string;
    factoringId: string;
    porcentajeFinanciamiento: number;
    fechaExpiracion: string;
    comentario: string;
    ofertaCondicionada: boolean;
} & OfertaCamposFinancieros;

export type UpdateOfertaPayload = {
    porcentajeFinanciamiento?: number;
    fechaExpiracion?: string;
    comentario?: string;
    ofertaCondicionada?: boolean;
} & Partial<OfertaCamposFinancieros>;

export type RespondOfertaPayload = {
    estado?: "aceptada" | "rechazada";
    comentarioEmpresa?: string;
};

/** El backend resuelve el bando del autor; el frontend no lo infiere. */
export type ComentarioOfertaTipo = "EMPRESA" | "FACTORING";

export interface ComentarioOfertaUsuario {
    id: string;
    nombre: string;
    tipo: ComentarioOfertaTipo;
}

export interface ComentarioOferta {
    id: string;
    comentario: string;
    createdAt: string;
    usuario: ComentarioOfertaUsuario;
}

export interface ComentariosOfertaResponse {
    ofertaId: string;
    items: ComentarioOferta[];
}
