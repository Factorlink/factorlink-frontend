export interface Empresa {
  createdAt?: string;
  direccion?: string;
  estadoEnrolamiento?: string;
  giro: string;
  email?: string;
  id?: string;
  isActive?: boolean;
  nivel?: string;
  razonSocial: string;
  rut: string;
  siiPassword?: string;
  siiRut?: string;
  siiSyncEnabled?: boolean;
  inviteAccepted?: string;
  inviteDate?: string;
}
