import * as yup from "yup";

export const validationSchema = yup.object({
  roleType: yup
    .string()
    .trim()
    .oneOf(["EMPRESA", "FACTORING"], "El tipo de entidad debe ser Empresa o Factoring")
    .required("El tipo de entidad es obligatorio"),
  firstName: yup
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .required("El nombre es obligatorio"),
  lastName: yup
    .string()
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .required("El apellido es obligatorio"),
  rut: yup
    .string()
    .trim()
    .required("El RUT es obligatorio")
    .matches(
      /^(\d{1,3}(?:\.\d{3}){2}-[\dkK])|(\d{7,8}-[\dkK])$/,
      "Formato de RUT inválido (ej: 12.345.678-9 o 12345678-9)"
    ),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email inválido")
    .required("El email es obligatorio"),
  phone: yup
    .string()
    .trim()
    .required("El teléfono es obligatorio")
    .matches(/^\+?[1-9]\d{1,14}$/, "El teléfono debe tener un formato válido ejemplo: +56999650987"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .matches(/[0-9]/, "La contraseña debe contener al menos un número"),
  confirmPassword: yup
    .string()
    .required("Confirmar contraseña es obligatorio")
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
  termsConditions: yup
    .boolean()
    .oneOf([true], "Debe aceptar los términos y condiciones")
    .required("Debe aceptar los términos y condiciones"),
});