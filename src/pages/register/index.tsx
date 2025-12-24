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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { StyledTextField } from "./styles";
import logo from "../../assets/png/factorlink-logo.png";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const { register, loading } = useAuth();

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
      const response = await register(values);
      setModalStatus("success");
      setModalOpen(true);
      debugger;
      useAuthStore.getState().setAccessToken(response.accessToken);
      useAuthStore.getState().setRefreshToken(response.refreshToken);
      useAuthStore.getState().setUser(response.user);

    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message[0] || "Error al registrar usuario");
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
    },
    validationSchema,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

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
                <img src={logo} alt="Factorlink Logo" style={{ maxWidth: 250 }} />
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
                  error={formik.touched.roleType && Boolean(formik.errors.roleType)}
                  helperText={formik.touched.roleType && formik.errors.roleType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="EMPRESA">Empresa</MenuItem>
                  <MenuItem value="FACTORING">Factoring</MenuItem>
                </StyledTextField>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nombre"
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Apellido"
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="RUT"
                  id="rut"
                  name="rut"
                  value={formik.values.rut}
                  error={formik.touched.rut && Boolean(formik.errors.rut)}
                  helperText={formik.touched.rut && formik.errors.rut}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Telefono móvil"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Confirmar contraseña"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      id="acceptedTerms"
                      name="termsConditions"
                      checked={formik.values.termsConditions}
                      onChange={formik.handleChange}
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
                    disabled={!formik.values.termsConditions || loading}
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
                    Crear cuenta
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
        <DialogTitle id="register-modal-title" sx={{ textAlign: "center", px: 3, pt: 3, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {modalStatus === "success" ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "success.main", display: "block" }} />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", display: "block" }} />
            )}
            <Typography variant="h5" fontWeight={600} component="span">
              {modalStatus === "success" ? "¡Registro exitoso!" : "Error en el registro"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography id="register-modal-description" variant="body1" color="text.secondary">
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
