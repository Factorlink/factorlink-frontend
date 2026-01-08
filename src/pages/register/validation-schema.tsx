import * as yup from "yup";
import {
  firstNameValidation,
  lastNameValidation,
  phoneValidation,
  rutValidation,
  validateRutVerifier,
  RUT_REGEX,
  passwordValidation,
  confirmPasswordValidation,
} from "../../utils/validations/shared-fields";

export const validationSchema = yup.object({
  roleType: yup
    .string()
    .trim()
    .oneOf(
      ["EMPRESA_ADMIN", "FACTORING_ADMIN"],
      "El tipo de entidad debe ser Empresa o Factoring"
    )
    .required("El tipo de entidad es obligatorio"),
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  rut: rutValidation,
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email inválido")
    .required("El email es obligatorio"),
  phone: phoneValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
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
          .matches(RUT_REGEX, "Formato de RUT inválido (ej: 12.345.678-9)")
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
