import * as yup from "yup";
import { RUT_REGEX, validateRutVerifier } from "../../utils/validations/shared-fields";

const optionalRutValidation = yup
  .string()
  .trim()
  .test("is-rut-valid", "Formato de RUT inválido (ej: 12.345.678-9)", (value) => {
    if (!value) return true; // Optional
    return RUT_REGEX.test(value);
  })
  .test("rut-verifier", "El RUT ingresado no es válido", (value) => {
    if (!value) return true; // Optional
    return validateRutVerifier(value);
  });

const optionalNumberValidation = yup
  .number()
  .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
  .nullable()
  .typeError("Debe ser un número válido")
  .min(0, "El monto no puede ser negativo");

export const facturasFiltersSchema = yup.object({
  rutEmisor: optionalRutValidation,
  rutReceptor: optionalRutValidation,
  razonSocialReceptor: yup.string().trim(),
  folio: yup.string().trim(),
  estado: yup.string(),
  
  montoTotal: optionalNumberValidation,
  minMontoTotal: optionalNumberValidation,
  maxMontoTotal: optionalNumberValidation
    .test("min-max-total", "El monto máximo debe ser mayor al mínimo", function (value) {
      const { minMontoTotal } = this.parent;
      if (value != null && minMontoTotal != null) {
        return value >= minMontoTotal;
      }
      return true;
    }),

  montoNeto: optionalNumberValidation,
  minMontoNeto: optionalNumberValidation,
  maxMontoNeto: optionalNumberValidation
    .test("min-max-neto", "El monto máximo debe ser mayor al mínimo", function (value) {
      const { minMontoNeto } = this.parent;
      if (value != null && minMontoNeto != null) {
        return value >= minMontoNeto;
      }
      return true;
    }),

  detalleIva: optionalNumberValidation,
  minDetalleIva: optionalNumberValidation,
  maxDetalleIva: optionalNumberValidation
    .test("min-max-iva", "El monto máximo debe ser mayor al mínimo", function (value) {
      const { minDetalleIva } = this.parent;
      if (value != null && minDetalleIva != null) {
        return value >= minDetalleIva;
      }
      return true;
    }),
});
