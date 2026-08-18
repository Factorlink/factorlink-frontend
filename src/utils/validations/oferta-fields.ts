import * as yup from "yup";

const DECIMAL_RATE_REGEX = /^(0|[1-9]\d{0,2})(\.\d{0,2})?$/;

const emptyToUndefined = (value: unknown, originalValue: unknown) =>
  originalValue === "" || originalValue === null ? undefined : value;

export const handleDecimalRateInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void,
) => {
  const { name, value } = e.target;
  if (value === "" || DECIMAL_RATE_REGEX.test(value)) {
    setFieldValue(name, value);
  }
};

/** Enteros ≥ 0. Permite "0"; bloquea "00", "01", "000". */
export const handleNonNegativeIntegerInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void,
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[^0-9]/g, "");
  if (filteredValue === "" || /^(0|[1-9]\d*)$/.test(filteredValue)) {
    setFieldValue(name, filteredValue);
  }
};

export const tasaValidation = yup
  .mixed()
  .required("La tasa es obligatoria")
  .test(
    "no-trailing-dot",
    "Ingresa un número decimal válido (ej: 0, 1.5, 10.25)",
    (value) => {
      if (value === undefined || value === null || value === "") return true;
      return !String(value).endsWith(".");
    },
  )
  .test("is-valid-range", "La tasa debe estar entre 0 y 100", (value) => {
    if (value === undefined || value === null || value === "") return true;
    const n = Number(value);
    return !isNaN(n) && n >= 0 && n <= 100;
  });

export const tasaComisionValidation = yup
  .mixed()
  .required("La tasa de comisión es obligatoria")
  .test(
    "no-trailing-dot",
    "Ingresa un número decimal válido (ej: 0, 1.5, 10.25)",
    (value) => {
      if (value === undefined || value === null || value === "") return true;
      return !String(value).endsWith(".");
    },
  )
  .test(
    "is-valid-range",
    "La tasa de comisión debe estar entre 0 y 100",
    (value) => {
      if (value === undefined || value === null || value === "") return true;
      const n = Number(value);
      return !isNaN(n) && n >= 0 && n <= 100;
    },
  );

export const nonNegativeIntegerValidation = yup
  .number()
  .transform(emptyToUndefined)
  .typeError("Debe ser un número entero")
  .required("Este campo es obligatorio")
  .integer("Debe ser un número entero")
  .min(0, "No puede ser negativo");

export const nonNegativeMoneyValidation = yup
  .number()
  .transform(emptyToUndefined)
  .typeError("Debe ser un número")
  .required("Este campo es obligatorio")
  .integer("Debe ser un número entero")
  .min(0, "No puede ser negativo")
  .test(
    "max-length",
    "No puede exceder 50 caracteres",
    (_value, ctx) => String(ctx.originalValue ?? "").length <= 50,
  );

export const createOfertaFormSchema = (minFechaExpiracion: Date) =>
  yup.object({
    porcentajeFinanciamiento: yup
      .number()
      .required("El porcentaje de financiamiento es obligatorio")
      .min(1, "Debe ser al menos 1%")
      .max(100, "No puede superar el 100%"),
    tasa: tasaValidation,
    fechaExpiracion: yup
      .date()
      .typeError("Ingresa una fecha válida")
      .required("La fecha de expiración es obligatoria")
      .min(minFechaExpiracion, "La fecha debe ser posterior a hoy")
      .nullable(),
    comentario: yup
      .string()
      .trim()
      .max(500, "El comentario no puede exceder 500 caracteres"),
    tipoDocumento: yup
      .string()
      .trim()
      .required("El tipo de documento es obligatorio")
      .max(100, "El tipo de documento no puede exceder 100 caracteres"),
    fechaOperacion: yup
      .date()
      .typeError("Ingresa una fecha válida")
      .required("La fecha de operación es obligatoria")
      .nullable(),
    numeroDocumentos: nonNegativeIntegerValidation,
    plazoPromedioPago: nonNegativeIntegerValidation,
    montoDocumentos: nonNegativeMoneyValidation,
    tasaComision: tasaComisionValidation,
    diferenciaPrecio: nonNegativeMoneyValidation,
    montoComision: nonNegativeMoneyValidation,
    retencion: nonNegativeMoneyValidation,
    notaria: nonNegativeMoneyValidation,
    gastosCobrados: nonNegativeMoneyValidation,
    iva: nonNegativeMoneyValidation,
    recuperacionGastos: nonNegativeMoneyValidation,
    recaudacion: nonNegativeMoneyValidation,
    excedentes: nonNegativeMoneyValidation,
    montoAGirar: nonNegativeMoneyValidation,
  });
