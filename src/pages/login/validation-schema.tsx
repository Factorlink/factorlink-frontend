import * as yup from "yup";
import { emailValidation } from "../../utils/validations/shared-fields";

export const loginValidationSchema = yup.object().shape({
  email: emailValidation,
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede exceder 128 caracteres"),
});
