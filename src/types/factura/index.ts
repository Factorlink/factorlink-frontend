import type { Empresa } from "../empresa";
import type { Factoring } from "../factoring";
import type { Oferta } from "../oferta";

interface VisibilidadDetalle {
    factorings: Factoring[];
}

export interface FacturaArchivo {
    id: string;
    facturaId: string;
    nombreArchivo: string;
    urlArchivo: string;
    signedUrl: string;
    mimeType: string;
    createdAt: string;
    updatedAt: string;
}

export type FacturaGrupoVisibilidad = "TODOS" | "SELECCIONADOS";

export interface CreateFacturaGrupoPayload {
    empresaId: string;
    nombre: string;
    porcentajeFinanciamiento: number;
    plazo: number;
    visibilidad: FacturaGrupoVisibilidad;
    factoringIds?: string[];
    facturaIds: string[];
}

export interface FacturaGrupo {
    id: string;
    nombre?: string;
    descripcion?: string | null;
    porcentajeFinanciamiento?: string | number;
    montoFinanciar?: string;
    plazo?: number;
    visibilidad?: FacturaGrupoVisibilidad | string;
    empresaId?: string;
    createdAt?: string;
    estado?: string;
    facturas?: Factura[];
    visibilidades?: unknown[];
}

export interface Factura {
    createdAt: string;
    descuentoGlobal: string;
    detalleIva: string;
    empresa: Empresa;
    empresaId: string;
    estado: string;
    facturaGrupoId?: string | null;
    facturaGrupo?: FacturaGrupo | null;
    facturaNameFile?: string | null;
    facturaNameFilePDF?: string | null;
    fechaEmision: string;
    fechaRecepcion: string;
    folio: string;
    id: string;
    montoFinanciar: string;
    montoNeto: string;
    montoTotal: string;
    plazo: number;
    porcentajeFinanciamiento?: string;
    razonSocialEmisor: string;
    razonSocialReceptor: string;
    rutEmisor: string;
    rutFirmante: string;
    rutReceptor: string;
    siiId: string;
    /** Estado reportado por el SII (si el backend lo envía). */
    estadoSii?: string | null;
    tipoDocumento: string;
    urlFactura?: string | null;
    urlFacturaPdf?: string | null;
    visibilidad: string;
    xmlContentBase64?: string | null;
    visibilidadDetalle: VisibilidadDetalle;
    numeroOfertasRecibidas?: number;
    historyOfertas?: Oferta[];
    factoringIsOfertme?: string;
    ofertaFactoring?: Oferta;
    pdfContentBase64?: string;
    archivos?: FacturaArchivo[];
}
