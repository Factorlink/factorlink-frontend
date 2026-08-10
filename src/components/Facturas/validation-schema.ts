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
  .string()
  .trim()
  .test("is-number", "Debe ser un número válido", (value) => {
    if (!value) return true;
    return /^[0-9]+$/.test(value);
  });

export const facturasFiltersSchema = yup.object({
  rutEmisor: optionalRutValidation,
  rutReceptor: optionalRutValidation,
  razonSocialReceptor: yup.array().of(yup.string()),
  folio: optionalNumberValidation,
  estado: yup.array().of(yup.string()),
  
  montoTotal: optionalNumberValidation,
  minMontoTotal: optionalNumberValidation,
  maxMontoTotal: optionalNumberValidation
    .test("min-max-total", "El monto máximo debe ser mayor al mínimo", function (value) {
      const { minMontoTotal } = this.parent;
      if (value && minMontoTotal) {
        return Number(value) >= Number(minMontoTotal);
      }
      return true;
    }),

  montoNeto: optionalNumberValidation,
  minMontoNeto: optionalNumberValidation,
  maxMontoNeto: optionalNumberValidation
    .test("min-max-neto", "El monto máximo debe ser mayor al mínimo", function (value) {
      const { minMontoNeto } = this.parent;
      if (value && minMontoNeto) {
        return Number(value) >= Number(minMontoNeto);
      }
      return true;
    }),

  detalleIva: optionalNumberValidation,
  minDetalleIva: optionalNumberValidation,
  maxDetalleIva: optionalNumberValidation
    .test("min-max-iva", "El monto máximo debe ser mayor al mínimo", function (value) {
      const { minDetalleIva } = this.parent;
      if (value && minDetalleIva) {
        return Number(value) >= Number(minDetalleIva);
      }
      return true;
    }),
});
