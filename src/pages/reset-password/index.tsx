import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import {
  Box,
  Button,
  Typography,
  Container,
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
import {
  authCardSx,
  authLogoColumnSx,
  authPageSx,
  authPrimaryButtonSx,
  authSecondaryButtonSx,
  authTabSx,
} from "../../theme";

const validationSchema = Yup.object({
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

const ResetPassword = () => {
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

  if (!token) {
    return (
      <Box sx={authPageSx}>
        <Container maxWidth="sm">
          <Box
            sx={{
              ...authCardSx,
              textAlign: "center",
              p: 4,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontFamily: "var(--font-heading)", fontWeight: 500 }}>
              Enlace inválido
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              El enlace de recuperación no es válido o ha expirado.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/forgot-password"
              sx={{ px: 4 }}
            >
              Solicitar nuevo enlace
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={authPageSx}>
      <Container maxWidth="md">
        <Box sx={authCardSx}>
          <Box sx={authTabSx}>Restablecer contraseña</Box>

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
            <Box sx={authLogoColumnSx}>
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

            <Box sx={{ paddingLeft: { md: 2 } }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
              </Typography>

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
                    sx={authSecondaryButtonSx}
                  >
                    Cancelar
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || !formik.dirty || loading}
                    sx={authPrimaryButtonSx}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
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
            borderRadius: "var(--radius-l)",
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
              <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "var(--color-fg-success-primary)", display: "block" }} />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)", display: "block" }} />
            )}
            <Typography variant="h5" component="span" sx={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>
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
            <Button variant="contained" color="primary" onClick={handleContinue} sx={{ px: 4, py: 1 }}>
              Ir al login
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal} sx={{ px: 3, py: 1 }}>
                Cerrar
              </Button>
              <Button variant="contained" color="primary" href="/forgot-password" sx={{ px: 3, py: 1 }}>
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
