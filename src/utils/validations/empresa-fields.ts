import * as yup from "yup";

const validateRutVerifier = (rut: string): boolean => {
  const cleanRut = rut.replace(/\./g, "").replace(/-/g, "");
  if (cleanRut.length < 2) return false;

  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();

  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedVerifier = 11 - remainder;

  let expectedVerifier: string;
  if (calculatedVerifier === 11) expectedVerifier = "0";
  else if (calculatedVerifier === 10) expectedVerifier = "K";
  else expectedVerifier = calculatedVerifier.toString();

  return verifier === expectedVerifier;
};

export const rutEmpresaValidation = yup
  .string()
  .trim()
  .required("El RUT es obligatorio")
  .matches(
    /^(\d{1,3}(?:\.\d{3}){2}-[\dkK])|(\d{7,8}-[\dkK])$/,
    "Formato de RUT inválido (ej: 12.345.678-9)"
  )
  .test("rut-verifier", "El RUT ingresado no es válido", (value) => {
    if (!value) return false;
    return validateRutVerifier(value);
  });

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
