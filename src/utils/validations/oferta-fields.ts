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

export const TASA_RANGE_MESSAGE = "La tasa debe estar entre 0 y 100";
export const TASA_DIARIA_MORA_RANGE_MESSAGE =
  "La tasa diaria de mora debe estar entre 0 y 100";

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
  .test("is-valid-range", TASA_RANGE_MESSAGE, (value) => {
    if (value === undefined || value === null || value === "") return true;
    const n = Number(value);
    return !isNaN(n) && n >= 0 && n <= 100;
  });

export const tasaDiariaMoraValidation = yup
  .mixed()
  .required("La tasa diaria de mora es obligatoria")
  .test(
    "no-trailing-dot",
    "Ingresa un número decimal válido (ej: 0, 0.05, 1.5)",
    (value) => {
      if (value === undefined || value === null || value === "") return true;
      return !String(value).endsWith(".");
    },
  )
  .test("is-valid-range", TASA_DIARIA_MORA_RANGE_MESSAGE, (value) => {
    if (value === undefined || value === null || value === "") return true;
    const n = Number(value);
    return !isNaN(n) && n >= 0 && n <= 100;
  });

export const nonNegativeIntegerValidation = yup
  .number()
  .transform(emptyToUndefined)
  .typeError("Debe ser un número entero")
  .required("Este campo es obligatorio")
  .integer("Debe ser un número entero")
  .min(0, "No puede ser negativo");

export const positiveIntegerValidation = yup
  .number()
  .transform(emptyToUndefined)
  .typeError("Debe ser un número entero")
  .required("Este campo es obligatorio")
  .integer("Debe ser un número entero")
  .min(1, "Debe ser al menos 1");

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

export const createOfertaFormSchema = () =>
  yup.object({
    diasFinanciamiento: positiveIntegerValidation,
    porcentajeFinanciamiento: yup
      .number()
      .required("El porcentaje de financiamiento es obligatorio")
      .min(1, "Debe ser al menos 1%")
      .max(100, "No puede superar el 100%"),
    fechaCotizacion: yup
      .date()
      .typeError("Ingresa una fecha válida")
      .required("La fecha de cotización es obligatoria")
      .nullable(),
    tasa30Dias: tasaValidation,
    saldoPendiente: nonNegativeMoneyValidation,
    montoComision: nonNegativeMoneyValidation,
    gastosAdministrativos: nonNegativeMoneyValidation,
    firmaDigital: nonNegativeMoneyValidation,
    tasaDiariaMora: tasaDiariaMoraValidation,
    cobroPorDiaMora: nonNegativeMoneyValidation,
    vigenciaOfertaDias: yup
      .number()
      .transform(emptyToUndefined)
      .typeError("Debe ser un número entero")
      .required("Los días de vigencia son obligatorios")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser al menos 1")
      .max(365, "No puede superar 365 días"),
    comentario: yup
      .string()
      .trim()
      .max(500, "El comentario no puede exceder 500 caracteres"),
    ofertaCondicionada: yup.boolean(),
  });
