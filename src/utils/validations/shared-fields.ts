import * as yup from "yup";

// Regex para caracteres especiales permitidos en contraseñas
export const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

// Regex para emails
export const EMAIL_WITH_DOT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailValidation = yup
  .string()
  .trim()
  .lowercase()
  .matches(EMAIL_WITH_DOT_REGEX, "Email inválido")
  .required("El email es obligatorio");

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

// Validación de dirección (compartida con empresa)
export const direccionValidation = yup
  .string()
  .trim()
  .min(5, "La dirección debe tener al menos 5 caracteres")
  .max(200, "La dirección no puede exceder 200 caracteres");

// Validación de cargo
export const cargoValidation = yup
  .string()
  .trim()
  .min(2, "El cargo debe tener al menos 2 caracteres")
  .max(100, "El cargo no puede exceder 100 caracteres");

// Validación de fecha de nacimiento
export const fechaNacimientoValidation = yup
  .date()
  .nullable()
  .max(new Date(), "La fecha no puede ser futura")
  .test("edad-minima", "Debes ser mayor de 18 años", (value) => {
    if (!value) return true;
    const hoy = new Date();
    const fechaNac = new Date(value);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNac = fechaNac.getMonth();
    if (mesActual < mesNac || (mesActual === mesNac && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad >= 18;
  });

// Preferencias de contacto
export const PREFERENCIAS_CONTACTO = ["whatsapp", "telefono", "email"] as const;
export type PreferenciaContacto = (typeof PREFERENCIAS_CONTACTO)[number];

export const preferenciaContactoValidation = yup
  .string()
  .oneOf([...PREFERENCIAS_CONTACTO], "Selecciona una preferencia válida");

// Schema parcial para reutilizar en Profile
export const profileFieldsSchema = yup.object({
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  phone: phoneValidation,
  rut: rutValidation,
  direccion: direccionValidation,
  cargo: cargoValidation,
  fechaNacimiento: fechaNacimientoValidation,
  preferenciaContacto: preferenciaContactoValidation,
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

// Handler para campos de texto general (dirección, cargo)
// Filtra caracteres potencialmente peligrosos
export const handleTextInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/[<>{}[\]\\]/g, "");
  setFieldValue(name, filteredValue);
};

// Handler para solo permitir números positivos (incluyendo el 0)
export const handlePositiveNumberInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  const { name, value } = e.target;
  // Solo permitir dígitos (0-9)
  const filteredValue = value.replace(/[^0-9]/g, "");

  setFieldValue(name, filteredValue);
};



