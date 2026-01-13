import * as yup from "yup";

// Regex para caracteres especiales permitidos en contraseñas
export const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

// Validación de contraseña robusta (para crear/cambiar contraseña)
export const passwordValidation = yup
  .string()
  .required("La contraseña es obligatoria")
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña no puede exceder 128 caracteres")
  .matches(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
  .matches(/[a-z]/, "La contraseña debe contener al menos una minúscula")
  .matches(/[0-9]/, "La contraseña debe contener al menos un número")
  .matches(SPECIAL_CHARS_REGEX, "La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?\":{}|<>)");

// Validación de confirmar contraseña
export const confirmPasswordValidation = yup
  .string()
  .required("Confirmar contraseña es obligatorio")
  .oneOf([yup.ref("password")], "Las contraseñas deben coincidir");

// Función de validación del dígito verificador del RUT chileno
export const validateRutVerifier = (rut: string): boolean => {
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

// Regex para formato RUT chileno
export const RUT_REGEX = /^(\d{1,3}(?:\.\d{3}){2}-[\dkK])|(\d{7,8}-[\dkK])$/;

// Validación de RUT requerido
export const rutValidation = yup
  .string()
  .trim()
  .required("El RUT es obligatorio")
  .matches(RUT_REGEX, "Formato de RUT inválido (ej: 12.345.678-9)")
  .test("rut-verifier", "El RUT ingresado no es válido", (value) => {
    if (!value) return false;
    return validateRutVerifier(value);
  });

// Validaciones de campos compartidos
export const firstNameValidation = yup
  .string()
  .trim()
  .matches(/^[A-Za-zÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios")
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede exceder 50 caracteres")
  .required("El nombre es obligatorio");

export const lastNameValidation = yup
  .string()
  .trim()
  .matches(/^[A-Za-zÀ-ÿ\s]+$/, "El apellido solo puede contener letras y espacios")
  .min(2, "El apellido debe tener al menos 2 caracteres")
  .max(50, "El apellido no puede exceder 50 caracteres")
  .required("El apellido es obligatorio");

export const phoneValidation = yup
  .string()
  .trim()
  .required("El teléfono es obligatorio")
  .min(12, "El teléfono debe tener un formato válido ejemplo: +56999650987")
  .max(12, "El teléfono debe tener un formato válido ejemplo: +56999650987")
  .matches(
    /^\+?[1-9]\d{1,14}$/,
    "El teléfono debe tener un formato válido ejemplo: +56999650987"
  );

// Schema parcial para reutilizar en Profile
export const profileFieldsSchema = yup.object({
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  phone: phoneValidation,
  rut: rutValidation,
});

// Handler para filtrar números en campos de nombre
export const handleNameInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
  setFieldValue(name, filteredValue);
};

// Handler para filtrar caracteres en campos de RUT
// Solo permite: números (0-9), puntos (.), guión (-) y la letra K/k
export const handleRutInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[^0-9.\-kK]/g, "");
  setFieldValue(name, filteredValue);
};

// Handler para formatear teléfono chileno
export const handlePhoneInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  let value = e.target.value;

  // Solo permitir números y el signo +
  value = value.replace(/[^\d+]/g, "");

  // Asegurar que el + solo esté al inicio
  const plusCount = (value.match(/\+/g) || []).length;
  if (plusCount > 1) {
    value = "+" + value.replace(/\+/g, "");
  }
  if (value.includes("+") && !value.startsWith("+")) {
    value = "+" + value.replace(/\+/g, "");
  }

  // Si el usuario empieza a escribir sin +56, agregarlo automáticamente
  if (value && !value.startsWith("+")) {
    value = "+569" + value;
  }

  // Limitar a 12 caracteres (+56 + 9 dígitos)
  if (value.length > 12) {
    value = value.slice(0, 12);
  }

  setFieldValue("phone", value);
};

export const handlePasswordInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/\s+/g, "");
  setFieldValue(name, filteredValue);
};
