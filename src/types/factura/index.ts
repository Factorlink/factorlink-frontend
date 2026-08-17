import type { Empresa } from "../empresa";
import type { Factoring } from "../factoring";
import type { Oferta } from "../oferta";



interface VisibilidadDetalle {
    factorings: Factoring[];
}

export interface Factura {
    createdAt: string;
    descuentoGlobal: string;
    detalleIva: string;
    empresa: Empresa;
    empresaId: string;
    estado: string;
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
    tipoDocumento: string;
    urlFactura?: string | null;
    urlFacturaPdf?: string | null;
    visibilidad: string;
    xmlContentBase64?: string | null;
    visibilidadDetalle: VisibilidadDetalle;
    numeroOfertasRecibidas?: number;
    historyOfertas?: Oferta[];
    factoringIsOfertme?: string;
    ofertaFactoring?: Oferta
    pdfContentBase64?: string;
}
