export interface Empresa {
  rut: string;
  razonSocial: string;
  giro: string;
  direccion?: string;
  siiRut?: string;
  siiPassword?: string;
  siiSyncEnabled?: boolean;
}
