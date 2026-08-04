import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { StyledTextField } from "../register/styles";
import logo from "../../assets/png/factorlink-logo.png";
import { useAuth } from "../../hooks/useAuth";
import { emailValidation } from "../../utils/validations/shared-fields";
import {
  authCardSx,
  authLogoColumnSx,
  authPageSx,
  authPrimaryButtonSx,
  authSecondaryButtonSx,
  authTabSx,
} from "../../theme";


const validationSchema = Yup.object({
  email: emailValidation,
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

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

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      setLoading(true);
      const normalizedEmail = values.email.trim().toLowerCase();
      await forgotPassword(normalizedEmail);
      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      
      // Solo mostrar error si es un problema de red/servidor (5xx)
      // Para errores 4xx mostrar mensaje genérico como si fuera éxito (seguridad)
      if (axiosError?.response?.status && axiosError.response.status >= 500) {
        setErrorMessage("Ocurrió un error de conexión. Intenta nuevamente.");
        setModalStatus("error");
      } else {
        // Simular éxito para no revelar si el email existe
        setModalStatus("success");
      }
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleForgotPassword(values);
    },
  });

  return (
    <Box sx={authPageSx}>
      <Container maxWidth="md">
        <Box sx={authCardSx}>
          <Box sx={authTabSx}>Recuperar contraseña</Box>

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
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </Typography>

              <Box>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  id="email"
                  name="email"
                  type="email"
                  disabled={loading}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    href="/login"
                    sx={authSecondaryButtonSx}
                  >
                    Volver al login
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
                      "Enviar"
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
        aria-labelledby="forgot-password-modal-title"
        aria-describedby="forgot-password-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle id="forgot-password-modal-title" sx={{ textAlign: "center", px: 3, pt: 3, pb: 1 }}>
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
              {modalStatus === "success" ? "¡Correo enviado!" : "Error"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography id="forgot-password-modal-description" variant="body1" color="text.secondary">
            {modalStatus === "success"
              ? "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
              : errorMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pt: 2, pb: 3 }}>
          {modalStatus === "success" ? (
            <Button variant="contained" color="primary" onClick={handleContinue} sx={{ px: 4, py: 1 }}>
              Ir al login
            </Button>
          ) : (
            <Button variant="contained" color="error" onClick={handleCloseModal} sx={{ px: 4, py: 1 }}>
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForgotPassword;
