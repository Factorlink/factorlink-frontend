export interface RegisterFormData {
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsConditions: boolean;
  roleType: string;
  factoringRut?: string;
  factoringRazonSocial?: string;
  factoringDireccion?: string;
}
