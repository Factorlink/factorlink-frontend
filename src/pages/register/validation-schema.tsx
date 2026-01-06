import * as yup from "yup";

const validateRutVerifier = (rut: string): boolean => {
  // Limpiar el RUT de puntos y guiones
  const cleanRut = rut.replace(/\./g, "").replace(/-/g, "");

  if (cleanRut.length < 2) return false;

  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();

  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(body)) return false;

  // Calcular dígito verificador usando módulo 11
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedVerifier = 11 - remainder;

  let expectedVerifier: string;
  if (calculatedVerifier === 11) {
    expectedVerifier = "0";
  } else if (calculatedVerifier === 10) {
    expectedVerifier = "K";
  } else {
    expectedVerifier = calculatedVerifier.toString();
  }

  return verifier === expectedVerifier;
};

export const validationSchema = yup.object({
  roleType: yup
    .string()
    .trim()
    .oneOf(
      ["EMPRESA_ADMIN", "FACTORING_ADMIN"],
      "El tipo de entidad debe ser Empresa o Factoring"
    )
    .required("El tipo de entidad es obligatorio"),
  firstName: yup
    .string()
    .trim()
    .matches(/^[^\d]*$/, "El nombre no puede contener números")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .required("El nombre es obligatorio"),
  lastName: yup
    .string()
    .trim()
    .matches(/^[^\d]*$/, "El apellido no puede contener números")
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
    )
    .test("rut-verifier", "El RUT ingresado no es válido", (value) => {
      if (!value) return false;
      return validateRutVerifier(value);
    }),
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
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "El teléfono debe tener un formato válido ejemplo: +56999650987"
    ),
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
  factoringRut: yup
    .string()
    .trim()
    .when("roleType", {
      is: "FACTORING_ADMIN",
      then: (schema) =>
        schema
          .required("El RUT de Factoring es obligatorio")
          .matches(
            /^(\d{1,3}(?:\.\d{3}){2}-[\dkK])|(\d{7,8}-[\dkK])$/,
            "Formato de RUT inválido (ej: 12.345.678-9 o 12345678-9)"
          )
          .test("rut-verifier", "El RUT ingresado no es válido", (value) => {
            if (!value) return false;
            return validateRutVerifier(value);
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
  factoringRazonSocial: yup
    .string()
    .trim()
    .when("roleType", {
      is: "FACTORING_ADMIN",
      then: (schema) =>
        schema
          .required("La Razón Social es obligatoria")
          .min(2, "La Razón Social debe tener al menos 2 caracteres")
          .max(100, "La Razón Social no puede exceder 100 caracteres"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
