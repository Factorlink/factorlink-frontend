export interface SiiPersonal {
  id?: string;
  userId?: string;
  siiRutPersonal?: string;
  siiPasswordPersonal?: string;
  siiEmailPersonal?: string;
  siiDireccionPersonal?: string;
  siiRazonSocialPersonal?: string;
  siiPasswordCertificadoPersonal?: string | null;
  telefono?: string;
  createdAt?: string;
}

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
  siiPersonalId?: string;
  siiPersonal?: SiiPersonal;
  siiDireccionPersonal?: string;
  siiEmailPersonal?: string;
  siiPasswordCertificadoPersonal?: string;
  siiPasswordPersonal?: string;
  siiRazonSocialPersonal?: string;
  siiRutPersonal?: string;
}

export const isSiiPersonalLinked = (empresa?: Empresa | null): boolean =>
  Boolean(empresa?.siiPersonal?.siiRutPersonal ?? empresa?.siiPersonalId);

/** Ensures personal SII fields are available under `siiPersonal` after API responses. */
export const normalizeEmpresaSiiPersonal = (empresa: Empresa): Empresa => {
  if (empresa.siiPersonal) return empresa;
  if (!empresa.siiRutPersonal && !empresa.siiPersonalId) return empresa;
  return {
    ...empresa,
    siiPersonal: {
      siiRutPersonal: empresa.siiRutPersonal,
      siiEmailPersonal: empresa.siiEmailPersonal,
      siiDireccionPersonal: empresa.siiDireccionPersonal,
      siiRazonSocialPersonal: empresa.siiRazonSocialPersonal,
      siiPasswordPersonal: empresa.siiPasswordPersonal,
      siiPasswordCertificadoPersonal: empresa.siiPasswordCertificadoPersonal,
    },
  };
};
