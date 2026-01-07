import * as yup from "yup";
import { rutValidation } from "./shared-fields";

// Re-exportar para mantener compatibilidad
export const rutEmpresaValidation = rutValidation;

export const razonSocialValidation = yup
  .string()
  .trim()
  .required("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .max(100, "La razón social no puede exceder 100 caracteres");

export const giroValidation = yup
  .string()
  .trim()
  .required("El giro es obligatorio")
  .max(200, "El giro no puede exceder 200 caracteres");

export const direccionValidation = yup
  .string()
  .trim()
  .min(5, "La dirección debe tener al menos 5 caracteres")
  .max(200, "La dirección no puede exceder 200 caracteres");

export const empresaFieldsSchema = yup.object({
  rut: rutEmpresaValidation,
  razonSocial: razonSocialValidation,
  giro: giroValidation,
  direccion: direccionValidation,
});
