import * as yup from "yup";

// Validaciones de campos compartidos
export const firstNameValidation = yup
  .string()
  .trim()
  .matches(/^[^\d]*$/, "El nombre no puede contener números")
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(50, "El nombre no puede exceder 50 caracteres")
  .required("El nombre es obligatorio");

export const lastNameValidation = yup
  .string()
  .trim()
  .matches(/^[^\d]*$/, "El apellido no puede contener números")
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
});

// Handler para filtrar números en campos de nombre
export const handleNameInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: string) => void
) => {
  const { name, value } = e.target;
  const filteredValue = value.replace(/\d/g, "");
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
    value = "+56" + value;
  }

  // Limitar a 12 caracteres (+56 + 9 dígitos)
  if (value.length > 12) {
    value = value.slice(0, 12);
  }

  setFieldValue("phone", value);
};
