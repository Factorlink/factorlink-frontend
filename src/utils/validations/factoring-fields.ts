import * as yup from "yup";
import { rutValidation, direccionValidation } from "./shared-fields";

export const rutFactoringValidation = rutValidation;

export const razonSocialFactoringValidation = yup
  .string()
  .trim()
  .required("La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .max(100, "La razón social no puede exceder 100 caracteres");

export const direccionFactoringValidation = direccionValidation;

export const factoringFieldsSchema = yup.object({
  rut: rutFactoringValidation,
  razonSocial: razonSocialFactoringValidation,
  direccion: direccionFactoringValidation,
});
