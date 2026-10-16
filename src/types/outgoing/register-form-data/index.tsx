export interface RegisterEmpresaPayload {
  rut: string;
  nombreSociedad?: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsConditions: boolean;
  privacyPolicy?: boolean;
  emailConsent?: boolean;
  roleType: string;
  direccion?: string;
  /** Personal SII password sent on Empresa registration (SII wizard flow). */
  password_sii_personal?: string;
  empresas?: RegisterEmpresaPayload[];
  factoringRut?: string;
  factoringRazonSocial?: string;
  factoringDireccion?: string;
}
