import { useState, useEffect } from "react";
import {
  Box,
  TextField,
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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import logo from "../../assets/png/factorlink-logo.png";
import siiLogo from "../../assets/png/sii-logo.png";
import { useAuth } from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";
import { loginValidationSchema } from "./validation-schema";

// Mapeo de errores del backend a mensajes amigables
const mapLoginError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = axiosError.response?.status;

    switch (status) {
      case 401:
        return "Email o contraseña incorrectos";
      case 403:
        return "Tu cuenta se encuentra inactiva. Contacta al administrador";
      case 404:
        return "Usuario no encontrado";
      case 429:
        return "Demasiados intentos. Espera unos minutos e intenta nuevamente";
      case 500:
      case 502:
      case 503:
        return "Error en el servidor. Intenta nuevamente más tarde";
      default:
        return "Ocurrió un error. Intenta nuevamente";
    }
  }

  // Error de red (sin respuesta del servidor)
  if (error && typeof error === "object" && "request" in error) {
    return "Error de conexión. Verifica tu conexión a internet";
  }

  return "Ocurrió un error. Intenta nuevamente";
};

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuth();
  const { accessToken } = useAuthStore();

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (accessToken && !modalOpen) {
      navigate("/dashboard", { replace: true });
    }
  }, [accessToken, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      acceptedTerms: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await login({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });
        setModalStatus("success");
        setModalOpen(true);
        useAuthStore.getState().setAccessToken(response.accessToken);
        useAuthStore.getState().setRefreshToken(response.refreshToken);
        useAuthStore.getState().setUser(response.user);
      } catch (error: unknown) {
        setModalStatus("error");
        setErrorMessage(mapLoginError(error));
        setModalOpen(true);
      }
    },
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalStatus === "success") {
      navigate("/dashboard");
    }
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
          {/* Suite Empresa Tab */}
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
            Suite Empresa
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
                {/* Diamond Logo */}
                <img
                  src={logo}
                  alt="Factorlink Logo"
                  style={{ maxWidth: 250 }}
                />
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              {/* SII Logo and Description */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 3,
                }}
              >
                {/* SII Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <img src={siiLogo} alt="SII Logo" style={{ maxWidth: 150 }} />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    flex: 1,
                  }}
                >
                  Ingresa tu rut y contraseña de SII para sincronizar la
                  información de tus facturas.
                  <br />
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
                    Más detalles del proceso.
                  </Link>
                </Typography>
              </Box>

              {/* Form Fields */}
              <Box component="form">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                      "& fieldset": {
                        borderColor: "divider",
                      },
                      "&:hover fieldset": {
                        borderColor: "text.disabled",
                      },
                      "& input": {
                        color: "text.secondary",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Contraseña"
                  placeholder="Contraseña"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={loading}
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                      "& fieldset": {
                        borderColor: "divider",
                      },
                      "&:hover fieldset": {
                        borderColor: "text.disabled",
                      },
                      "& input::placeholder": {
                        color: "text.disabled",
                        opacity: 1,
                      },
                    },
                  }}
                />

                {/* Link de recuperar contraseña */}
                <Box sx={{ textAlign: "right", mb: 2 }}>
                  <Link
                    href="/forgot-password"
                    sx={{
                      color: "success.main",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    title="Próximamente"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptedTerms"
                      checked={formik.values.acceptedTerms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      size="small"
                      disabled={loading}
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
                        color:
                          formik.touched.acceptedTerms &&
                          formik.errors.acceptedTerms
                            ? "error.main"
                            : "text.secondary",
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
                        términos de SII
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                {formik.touched.acceptedTerms &&
                  formik.errors.acceptedTerms && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block", mb: 2, ml: 2 }}
                    >
                      {formik.errors.acceptedTerms}
                    </Typography>
                  )}

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    onClick={() => navigate("/register")}
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
                    Registrarse
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={loading || !formik.isValid || !formik.dirty}
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
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Siguiente"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Modal de resultado */}
      <Dialog
        open={modalOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleCloseModal();
          }
        }}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 350,
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            {modalStatus === "success" ? (
              <CheckCircleOutlineIcon
                sx={{ fontSize: 48, color: "success.main" }}
              />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main" }} />
            )}
            <Typography variant="h6" component="span">
              {modalStatus === "success"
                ? "¡Inicio de sesión exitoso!"
                : "Error en el inicio de sesión"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {modalStatus === "success"
              ? "Has iniciado sesión correctamente."
              : errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pt: 1, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{
              backgroundColor:
                modalStatus === "success" ? "success.main" : "error.main",
              color: "white",
              textTransform: "none",
              px: 4,
              "&:hover": {
                backgroundColor:
                  modalStatus === "success" ? "success.dark" : "error.dark",
              },
            }}
          >
            {modalStatus === "success" ? "Continuar" : "Cerrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
