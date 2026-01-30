import type { Empresa } from "../empresa";

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
}
