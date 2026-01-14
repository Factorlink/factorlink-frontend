import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import {
  Box,
  Button,
  Typography,
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
import { StyledTextField } from "../register/styles";
import logo from "../../assets/png/factorlink-logo.png";
import { useAuth } from "../../hooks/useAuth";
import {
  passwordValidation,
  confirmPasswordValidation,
  handlePasswordInputChange,
} from "../../utils/validations/shared-fields";

const validationSchema = Yup.object({
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword } = useAuth();

  const handleCloseModal = (
    _event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setModalOpen(false);
  };

  const handleContinue = () => {
    setModalOpen(false);
    navigate("/login");
  };

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    if (!token) {
      setErrorMessage("Token de recuperación no válido o expirado.");
      setModalStatus("error");
      setModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      const cleanPassword = values.password.trim();
      await resetPassword(token, cleanPassword);
      setModalStatus("success");
      setModalOpen(true);
      formik.resetForm();
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string[] } } };
      
      if (axiosError?.response?.status === 400 || axiosError?.response?.status === 401) {
        setErrorMessage("El enlace de recuperación no es válido o ha expirado.");
      } else if (axiosError?.response?.status && axiosError.response.status >= 500) {
        setErrorMessage("Ocurrió un error de conexión. Intenta nuevamente.");
      } else {
        setErrorMessage("Ocurrió un error al restablecer la contraseña.");
      }
      setModalStatus("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleResetPassword(values);
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePasswordInputChange(e, formik.setFieldValue);
  };

  // Si no hay token, mostrar mensaje de error
  if (!token) {
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
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              textAlign: "center",
              p: 4,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Enlace inválido
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              El enlace de recuperación no es válido o ha expirado.
            </Typography>
            <Button
              variant="contained"
              href="/forgot-password"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                textTransform: "none",
                px: 4,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Solicitar nuevo enlace
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

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
            Restablecer contraseña
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" },
              gap: 4,
              padding: { xs: 3, md: 5 },
              alignItems: "center",
              minHeight: 300,
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
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
              </Typography>

              {/* Form Fields */}
              <Box>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Nueva contraseña"
                  placeholder="Nueva contraseña"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  inputProps={{ maxLength: 128, autoComplete: "new-password" }}
                  disabled={loading}
                  value={formik.values.password}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
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
                  label="Confirmar contraseña"
                  placeholder="Confirmar contraseña"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  inputProps={{ maxLength: 128, autoComplete: "new-password" }}
                  disabled={loading}
                  value={formik.values.confirmPassword}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    href="/login"
                    disabled={loading}
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
                    Cancelar
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
                      "Restablecer"
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
        aria-labelledby="reset-password-modal-title"
        aria-describedby="reset-password-modal-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle id="reset-password-modal-title" sx={{ textAlign: "center", px: 3, pt: 3, pb: 1 }}>
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
              {modalStatus === "success" ? "¡Contraseña actualizada!" : "Error"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography id="reset-password-modal-description" variant="body1" color="text.secondary">
            {modalStatus === "success"
              ? "Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña."
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
              Ir al login
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{
                  borderColor: "grey.400",
                  color: "text.primary",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "grey.600",
                    backgroundColor: "grey.50",
                  },
                }}
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                href="/forgot-password"
                sx={{
                  backgroundColor: "primary.main",
                  color: "common.white",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Solicitar nuevo enlace
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetPassword;
