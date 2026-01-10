import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import type { RegisterFormData } from "../../types/outgoing/register-form-data";
import { validationSchema } from "./validation-schema";
import { useAuth } from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";

import {
  Box,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Container,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { StyledTextField } from "./styles";
import logo from "../../assets/png/factorlink-logo.png";
import {
  handlePhoneInputChange,
  handleNameInputChange,
  handleRutInputChange,
  handlePasswordInputChange,
} from "../../utils/validations/shared-fields";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, login, loading } = useAuth();

  const handleCloseModal = (
    _event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setModalOpen(false);
  };

  const handleContinue = () => {
    setModalOpen(false);
    navigate("/dashboard");
  };

  const handleRegister = async (values: RegisterFormData) => {
    try {
      await register(values);
      const response = await login({
        email: values.email,
        password: values.password,
      });

      if (response.user.roles.length === 1) {
          useAuthStore.getState().setCurrentRole(response.user.roles[0]);
        } 

      setModalStatus("success");
      setModalOpen(true);
      useAuthStore.getState().setAccessToken(response.accessToken);
      useAuthStore.getState().setRefreshToken(response.refreshToken);
      useAuthStore.getState().setUser(response.user);
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

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      roleType: "",
      firstName: "",
      lastName: "",
      rut: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsConditions: false,
      factoringRut: "",
      factoringRazonSocial: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  // Función para filtrar números del input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNameInputChange(e, formik.setFieldValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneInputChange(e, formik.setFieldValue);
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRutInputChange(e, formik.setFieldValue);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePasswordInputChange(e, formik.setFieldValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "primary.dark",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          {/* Suite Tab */}
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "common.white",
              padding: "12px 28px",
              width: "fit-content",
              borderRadius: "0 0 16px 0",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Registro
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
              gap: 4,
              padding: { xs: 3, md: 5 },
              alignItems: "center",
              minHeight: 400,
            }}
          >
            {/* Left Side - Factorlink Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRight: {
                  xs: "none",
                  md: `1px solid ${theme.palette.divider}`,
                },
                paddingRight: { md: 4 },
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <img
                  src={logo}
                  alt="Factorlink Logo"
                  style={{ maxWidth: 250 }}
                />
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              {/* Form Fields */}
              <Box>
                <StyledTextField
                  select
                  fullWidth
                  defaultValue=""
                  label="Tipo de entidad"
                  id="roleType"
                  name="roleType"
                  disabled={loading}
                  error={
                    formik.touched.roleType && Boolean(formik.errors.roleType)
                  }
                  helperText={formik.touched.roleType && formik.errors.roleType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="EMPRESA_ADMIN">Empresa</MenuItem>
                  <MenuItem value="FACTORING_ADMIN">Factoring</MenuItem>
                </StyledTextField>
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
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                />
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
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                />
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

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  id="email"
                  name="email"
                  type="email"
                  disabled={loading}
                  inputProps={{ maxLength: 100 }}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

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
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  onChange={handlePhoneChange}
                  onBlur={formik.handleBlur}
                />

                {/* Campos adicionales para Factoring */}
                {formik.values.roleType === "FACTORING_ADMIN" && (
                  <>
                    <StyledTextField
                      fullWidth
                      variant="outlined"
                      label="RUT de Factoring"
                      placeholder="12.345.678-9"
                      id="factoringRut"
                      name="factoringRut"
                      disabled={loading}
                      value={formik.values.factoringRut || ""}
                      error={
                        formik.touched.factoringRut &&
                        Boolean(formik.errors.factoringRut)
                      }
                      helperText={
                        formik.touched.factoringRut &&
                        formik.errors.factoringRut
                      }
                      onChange={handleRutChange}
                      onBlur={formik.handleBlur}
                    />
                    <StyledTextField
                      fullWidth
                      variant="outlined"
                      label="Razón Social"
                      placeholder="Nombre de la empresa"
                      id="factoringRazonSocial"
                      name="factoringRazonSocial"
                      disabled={loading}
                      inputProps={{ maxLength: 100 }}
                      value={formik.values.factoringRazonSocial || ""}
                      error={
                        formik.touched.factoringRazonSocial &&
                        Boolean(formik.errors.factoringRazonSocial)
                      }
                      helperText={
                        formik.touched.factoringRazonSocial &&
                        formik.errors.factoringRazonSocial
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </>
                )}

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  placeholder="Mínimo 8 caracteres"
                  id="password"
                  name="password"
                  inputProps={{ maxLength: 100 }}
                  disabled={loading}
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  id="confirmPassword"
                  name="confirmPassword"
                  inputProps={{ maxLength: 100 }}
                  disabled={loading}
                  value={formik.values.confirmPassword}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          disabled={loading}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      id="acceptedTerms"
                      name="termsConditions"
                      checked={formik.values.termsConditions}
                      onChange={formik.handleChange}
                      disabled={loading}
                      size="small"
                      sx={{
                        color: "text.disabled",
                        "&.Mui-checked": {
                          color: "success.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "text.secondary",
                      }}
                    >
                      He leído y acepto los{" "}
                      <Link
                        href="#"
                        sx={{
                          color: "success.main",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        términos y condiciones de uso
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    href="/login"
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "white",
                      textTransform: "none",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "secondary.dark",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Ya tengo cuenta
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || !formik.dirty || loading}
                    sx={{
                      backgroundColor: "success.main",
                      color: "white",
                      textTransform: "none",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: 2,
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
                      "Crear cuenta"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="register-modal-title"
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
                ? "¡Registro exitoso!"
                : "Error en el registro"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography
            id="register-modal-description"
            variant="body1"
            color="text.secondary"
          >
            {modalStatus === "success"
              ? "Tu cuenta ha sido creada correctamente. Ya puedes acceder a todas las funcionalidades de la plataforma."
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
                borderRadius: 2,
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
                borderRadius: 2,
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
    </Box>
  );
};

export default Register;
