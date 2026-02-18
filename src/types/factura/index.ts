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
    facturaNameFile: string;
    fechaEmision: string;
    fechaRecepcion: string;
    folio: string;
    id: string;
    montoFinanciar: string;
    montoNeto: string;
    montoTotal: string;
    plazo: number;
    razonSocialEmisor: string;
    razonSocialReceptor: string;
    rutEmisor: string;
    rutFirmante: string;
    rutReceptor: string;
    siiId: string;
    tipoDocumento: string;
    urlFactura: string;
    visibilidad: string;
    xmlContentBase64: string;
    visibilidadDetalle: VisibilidadDetalle;
    numeroOfertasRecibidas?: number;
    historyOfertas?: Oferta[];
    factoringIsOfertme?: string;
    ofertaFactoring?: Oferta
}
