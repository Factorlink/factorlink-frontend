export interface ValidateSiiRequest {
  rut: string;
  password: string;
}

export interface ValidatedSiiEmpresa {
  rut: string;
  nombreSociedad?: string;
  /** Alias kept for UI convenience */
  razonSocial?: string;
}

export interface ValidatedSiiData {
  rut: string;
  firstName: string;
  lastName: string;
  email?: string;
  direccion?: string;
  giroCntr?: string;
  empresas?: ValidatedSiiEmpresa[];
  registrationToken?: string;
}

/** Matches POST auth/validated-sii response. */
export interface ValidateSiiResponseRaw {
  firstName: string;
  lastName: string;
  rut: string;
  direccion?: string;
  email?: string;
  giroCntr?: string;
  empresas?: Array<{
    rut: string;
    nombreSociedad?: string;
  }>;
  registrationToken?: string;
  token?: string;
}

/**
 * Normalizes backend payload into the shape the wizard UI expects.
 */
export function normalizeValidateSiiResponse(
  raw: ValidateSiiResponseRaw,
  fallbackRut: string,
): ValidatedSiiData {
  return {
    rut: raw.rut ?? fallbackRut,
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    email: raw.email,
    direccion: raw.direccion,
    giroCntr: raw.giroCntr,
    empresas: raw.empresas?.map((empresa) => ({
      rut: empresa.rut,
      nombreSociedad: empresa.nombreSociedad,
      razonSocial: empresa.nombreSociedad,
    })),
    registrationToken: raw.registrationToken ?? raw.token,
  };
}
