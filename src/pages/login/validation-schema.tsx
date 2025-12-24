import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio")
    .email("El formato del correo electrónico no es válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  acceptedTerms: yup
    .boolean()
    .oneOf([true], "Debe aceptar los términos y condiciones")
    .required("Debe aceptar los términos y condiciones"),
});
