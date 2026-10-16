import * as yup from "yup";
import {
  MAX_DIAS_FINANCIAMIENTO,
  MAX_DIAS_VIGENCIA_OFERTA,
} from "../consts";

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

/** Entero positivo de hasta 3 dígitos. Rechaza cero inicial. */
export const handlePositiveIntegerMax3InputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void,
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[^0-9]/g, "");
  if (filteredValue.startsWith("0") || filteredValue.length > 3) return;
  setFieldValue(name, filteredValue);
};

export const rangeErrorMessage = (
  fieldName: string,
  min: number,
  max: number,
) => `${fieldName} debe estar entre ${min} y ${max}`;

export const TASA_RANGE_MESSAGE = rangeErrorMessage("Tasa 30 días", 0, 100);
export const TASA_DIARIA_MORA_RANGE_MESSAGE = rangeErrorMessage(
  "Tasa diaria de mora",
  0,
  100,
);
const DIAS_FINANCIAMIENTO_RANGE_MESSAGE = rangeErrorMessage(
  "Días de financiamiento",
  1,
  MAX_DIAS_FINANCIAMIENTO,
);
const PORCENTAJE_FINANCIAMIENTO_RANGE_MESSAGE = rangeErrorMessage(
  "Porcentaje de financiamiento",
  1,
  100,
);
const DIAS_VIGENCIA_RANGE_MESSAGE = rangeErrorMessage(
  "Días de vigencia",
  1,
  MAX_DIAS_VIGENCIA_OFERTA,
);

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

/** Opcional: vacío se trata como 0 en submit; si hay valor debe ser entero ≥ 0. */
export const optionalNonNegativeMoneyValidation = yup
  .number()
  .transform(emptyToUndefined)
  .typeError("Debe ser un número")
  .nullable()
  .notRequired()
  .integer("Debe ser un número entero")
  .min(0, "No puede ser negativo")
  .test(
    "max-length",
    "No puede exceder 50 caracteres",
    (_value, ctx) => String(ctx.originalValue ?? "").length <= 50,
  );

export const createOfertaFormSchema = () =>
  yup.object({
    diasFinanciamiento: positiveIntegerValidation
      .min(1, DIAS_FINANCIAMIENTO_RANGE_MESSAGE)
      .max(MAX_DIAS_FINANCIAMIENTO, DIAS_FINANCIAMIENTO_RANGE_MESSAGE),
    porcentajeFinanciamiento: yup
      .number()
      .required("El porcentaje de financiamiento es obligatorio")
      .min(1, PORCENTAJE_FINANCIAMIENTO_RANGE_MESSAGE)
      .max(100, PORCENTAJE_FINANCIAMIENTO_RANGE_MESSAGE),
    fechaCotizacion: yup
      .date()
      .typeError("Ingresa una fecha válida")
      .required("La fecha de cotización es obligatoria")
      .nullable(),
    tasa30Dias: tasaValidation,
    montoComision: nonNegativeMoneyValidation,
    gastosAdministrativos: nonNegativeMoneyValidation,
    saldoPendiente: optionalNonNegativeMoneyValidation,
    tasaDiariaMora: tasaDiariaMoraValidation,
    vigenciaOfertaDias: yup
      .number()
      .transform(emptyToUndefined)
      .typeError("Debe ser un número entero")
      .required("Los días de vigencia son obligatorios")
      .integer("Debe ser un número entero")
      .min(1, DIAS_VIGENCIA_RANGE_MESSAGE)
      .max(MAX_DIAS_VIGENCIA_OFERTA, DIAS_VIGENCIA_RANGE_MESSAGE),
    comentario: yup
      .string()
      .trim()
      .max(500, "El comentario no puede exceder 500 caracteres")
      .when("ofertaCondicionada", {
        is: true,
        then: (schema) =>
          schema.required(
            "El comentario es obligatorio en ofertas condicionadas",
          ),
        otherwise: (schema) => schema.notRequired(),
      }),
    ofertaCondicionada: yup.boolean(),
  });
