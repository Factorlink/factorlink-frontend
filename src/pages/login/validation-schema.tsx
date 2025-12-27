import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio")
    .email("El formato del correo electrónico no es válido")
    .max(255, "El correo electrónico no puede exceder 255 caracteres"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede exceder 128 caracteres"),
  acceptedTerms: yup
    .boolean()
    .oneOf([true], "Debe aceptar los términos y condiciones")
    .required("Debe aceptar los términos y condiciones"),
});
