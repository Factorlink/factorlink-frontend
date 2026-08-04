import { useState } from "react";
import { useFormik } from "formik";
import { useUser } from "../../../hooks/useUser";
import useAuthStore from "../../../store/authStore";
import {
  profileFieldsSchema,
  handleNameInputChange,
  handlePhoneInputChange,
  handleRutInputChange,
  handleTextInputChange,
  PREFERENCIAS_CONTACTO,
} from "../../../utils/validations/shared-fields";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { StyledTextField, StyledDatePicker } from "../../../pages/register/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { surface } from "../../../theme";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  rut: string;
  direccion: string;
  cargo: string;
  fechaNacimiento: Date | null;
  preferenciaContacto: string;
}

const PREFERENCIA_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  telefono: "Teléfono",
  email: "Email",
};

const Profile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { updateUserProfile, loading } = useUser();
  const { user } = useAuthStore();

  const handleCloseModal = (
    _event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setModalOpen(false);
  };

  const handleContinue = () => {
    setModalOpen(false);
  };

  const handleUpdateProfile = async (values: ProfileFormData) => {
    try {
      const response = await updateUserProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
        direccion: values.direccion?.trim() || undefined,
        cargo: values.cargo?.trim() || undefined,
        fechaNacimiento: values.fechaNacimiento
          ? values.fechaNacimiento.toISOString().split("T")[0]
          : undefined,
        preferenciaContacto: values.preferenciaContacto || undefined,
      });

      // Update user in store
      useAuthStore.getState().setUser({
        ...user!,
        firstName: response.firstName || values.firstName.trim(),
        lastName: response.lastName || values.lastName.trim(),
        phone: response.phone || values.phone.trim(),
        direccion: response.direccion || values.direccion?.trim(),
        cargo: response.cargo || values.cargo?.trim(),
        fechaNacimiento: response.fechaNacimiento || values.fechaNacimiento,
        preferenciaContacto:
          response.preferenciaContacto || values.preferenciaContacto,
      });

      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error, intenta nuevamente"
      );
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const parseInitialDate = (
    date: string | Date | undefined
  ): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return date;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      rut: user?.rut || "",
      direccion: user?.direccion || "",
      cargo: user?.cargo || "",
      fechaNacimiento: parseInitialDate(user?.fechaNacimiento),
      preferenciaContacto: user?.preferenciaContacto || "",
    },
    validationSchema: profileFieldsSchema,
    onSubmit: (values) => {
      handleUpdateProfile(values);
    },
    enableReinitialize: true,
  });

  // Handlers compartidos para filtrado de input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNameInputChange(e, formik.setFieldValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneInputChange(e, formik.setFieldValue);
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRutInputChange(e, formik.setFieldValue);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTextInputChange(e, formik.setFieldValue);
  };

  return (
    <>
      <Box
        sx={{
          ...surface.card,
          overflow: "hidden",
        }}
      >
          <Box
            sx={{
              display: "grid",
              padding: { xs: 3, md: 5 },
              alignItems: "center",
              minHeight: 400,
              width: "100%",
            }}
          >
            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Actualiza tu información personal
              </Typography>

              {/* Form Fields */}
              <Box>
                {/* Nombre */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Nombre"
                  placeholder="Nombre"
                  id="firstName"
                  name="firstName"
                  inputProps={{ maxLength: 50 }}
                  disabled={loading}
                  value={formik.values.firstName}
                  error={
                    formik.touched.firstName &&
                    Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                />

                {/* Apellido */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Apellido"
                  placeholder="Apellido"
                  id="lastName"
                  name="lastName"
                  inputProps={{ maxLength: 50 }}
                  disabled={loading}
                  value={formik.values.lastName}
                  error={
                    formik.touched.lastName &&
                    Boolean(formik.errors.lastName)
                  }
                  helperText={
                    formik.touched.lastName && formik.errors.lastName
                  }
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                />

                {/* Email (read-only) */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  disabled
                  value={user?.email || ""}
                />

                {/* RUT */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="RUT"
                  placeholder="12.345.678-9"
                  id="rut"
                  name="rut"
                  inputProps={{ maxLength: 20 }}
                  disabled={loading}
                  value={formik.values.rut}
                  error={formik.touched.rut && Boolean(formik.errors.rut)}
                  helperText={formik.touched.rut && formik.errors.rut}
                  onChange={handleRutChange}
                  onBlur={formik.handleBlur}
                />

                {/* Teléfono */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Teléfono móvil"
                  placeholder="+56999650987"
                  type="tel"
                  id="phone"
                  name="phone"
                  disabled={loading}
                  value={formik.values.phone}
                  error={
                    formik.touched.phone && Boolean(formik.errors.phone)
                  }
                  helperText={formik.touched.phone && formik.errors.phone}
                  onChange={handlePhoneChange}
                  onBlur={formik.handleBlur}
                />

                {/* Dirección */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Dirección"
                  placeholder="Av. Providencia 1234, Santiago"
                  id="direccion"
                  name="direccion"
                  disabled={loading}
                  value={formik.values.direccion}
                  inputProps={{ maxLength: 200 }}
                  error={
                    formik.touched.direccion && Boolean(formik.errors.direccion)
                  }
                  helperText={
                    formik.touched.direccion && formik.errors.direccion
                  }
                  onChange={handleTextChange}
                  onBlur={formik.handleBlur}
                />

                {/* Cargo */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Cargo"
                  placeholder="Gerente General"
                  id="cargo"
                  name="cargo"
                  disabled={loading}
                  value={formik.values.cargo}
                  inputProps={{ maxLength: 100 }}
                  error={
                    formik.touched.cargo && Boolean(formik.errors.cargo)
                  }
                  helperText={formik.touched.cargo && formik.errors.cargo}
                  onChange={handleTextChange}
                  onBlur={formik.handleBlur}
                />

                {/* Fecha de Nacimiento */}
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <StyledDatePicker
                    label="Fecha de Nacimiento"
                    value={formik.values.fechaNacimiento}
                    open={datePickerOpen}
                    onOpen={() => setDatePickerOpen(true)}
                    onClose={() => {
                      setDatePickerOpen(false);
                      formik.setFieldTouched("fechaNacimiento", true, true);
                    }}
                    onChange={(date) => {
                      formik.setFieldValue("fechaNacimiento", date);
                      formik.setFieldTouched("fechaNacimiento", true);
                    }}
                    onAccept={() =>
                      formik.setFieldTouched("fechaNacimiento", true, true)
                    }
                    maxDate={new Date()}
                    disabled={loading}
                    slotProps={{
                      field: { readOnly: true },
                      openPickerButton: { tabIndex: -1 },
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        id: "fechaNacimiento",
                        name: "fechaNacimiento",
                        onClick: () => !loading && setDatePickerOpen(true),
                        onKeyDown: (e: React.KeyboardEvent) => e.preventDefault(),
                        onBlur: formik.handleBlur,
                        error:
                          !!(
                            formik.touched.fechaNacimiento &&
                            formik.errors.fechaNacimiento
                          ),
                        helperText:
                          formik.touched.fechaNacimiento &&
                          formik.errors.fechaNacimiento,
                        sx: {
                          cursor: "pointer",
                          "& .MuiOutlinedInput-root": {
                            cursor: "pointer",
                            "& input": { cursor: "pointer" },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                {/* Row 5: Preferencia de Contacto */}
                <FormControl
                  fullWidth
                  error={
                    formik.touched.preferenciaContacto &&
                    Boolean(formik.errors.preferenciaContacto)
                  }
                  sx={{ mt: 2, mb: 2 }}
                  disabled={loading}
                >
                  <InputLabel id="preferenciaContacto-label">
                    Preferencia de Contacto
                  </InputLabel>
                  <Select
                    labelId="preferenciaContacto-label"
                    id="preferenciaContacto"
                    name="preferenciaContacto"
                    value={formik.values.preferenciaContacto}
                    label="Preferencia de Contacto"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                sx={{
                  borderRadius: "var(--radius-m)",
                  backgroundColor: "background.default",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    {PREFERENCIAS_CONTACTO.map((pref) => (
                      <MenuItem key={pref} value={pref}>
                        {PREFERENCIA_LABELS[pref]}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.preferenciaContacto &&
                    formik.errors.preferenciaContacto && (
                      <FormHelperText>
                        {formik.errors.preferenciaContacto}
                      </FormHelperText>
                    )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => formik.resetForm()}
                    disabled={loading || !formik.dirty}
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "white",
                      textTransform: "none",
                      padding: "12px 24px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: "var(--radius-m)",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "secondary.dark",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || !formik.dirty || loading}
                    sx={{
                      backgroundColor: "success.main",
                      color: "white",
                      textTransform: "none",
                      padding: "12px 24px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: "var(--radius-m)",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "success.dark",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="profile-modal-title"
          sx={{ textAlign: "center", px: 3, pt: 3, pb: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {modalStatus === "success" ? (
              <CheckCircleOutlineIcon
                sx={{ fontSize: 64, color: "success.main", display: "block" }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ fontSize: 64, color: "error.main", display: "block" }}
              />
            )}
            <Typography variant="h5" fontWeight={600} component="span">
              {modalStatus === "success"
                ? "¡Perfil actualizado!"
                : "Error al actualizar"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography
            id="profile-modal-description"
            variant="body1"
            color="text.secondary"
          >
            {modalStatus === "success"
              ? "Tu información ha sido actualizada correctamente."
              : errorMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pt: 2, pb: 3 }}>
          {modalStatus === "success" ? (
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                backgroundColor: "success.main",
                color: "common.white",
                textTransform: "none",
                px: 4,
                py: 1,
                borderRadius: "var(--radius-m)",
                "&:hover": {
                  backgroundColor: "success.dark",
                },
              }}
            >
              Continuar
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{
                backgroundColor: "error.main",
                color: "common.white",
                textTransform: "none",
                px: 4,
                py: 1,
                borderRadius: "var(--radius-m)",
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
            >
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
