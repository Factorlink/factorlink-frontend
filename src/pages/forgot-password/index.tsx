import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  Box,
  Button,
  Typography,
  Link,
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
  authCenteredPageSx,
  authFormSx,
  authLinkSx,
  authLogoImgSx,
  authLogoLinkSx,
  authPrimaryButtonSx,
  authTitleSx,
} from "../../theme";

const validationSchema = Yup.object({
  email: emailValidation,
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
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
    <Box sx={authCenteredPageSx}>
      <Box component="a" href="/login" sx={authLogoLinkSx}>
        <Box
          component="img"
          src={logo}
          alt="Factorlink"
          sx={authLogoImgSx}
        />
      </Box>

      <Typography variant="h3" component="h1" sx={authTitleSx}>
        ¿Olvidaste tu contraseña?
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        sx={authFormSx}
      >
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mb: 3,
            color: "var(--color-fg-default-secondary)",
          }}
        >
          Ingresa tu correo electrónico y te enviaremos instrucciones para
          restablecer tu contraseña.
        </Typography>

        <StyledTextField
          fullWidth
          variant="outlined"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={loading}
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={!formik.isValid || !formik.dirty || loading}
          sx={{ ...authPrimaryButtonSx, mt: 1 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Enviar"
          )}
        </Button>

        <Link
          href="/login"
          sx={{
            ...authLinkSx,
            display: "block",
            textAlign: "center",
            mt: 2.5,
          }}
        >
          Volver al login
        </Link>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="forgot-password-modal-title"
        aria-describedby="forgot-password-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="forgot-password-modal-title"
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
                sx={{
                  fontSize: 64,
                  color: "var(--color-fg-success-primary)",
                  display: "block",
                }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{
                  fontSize: 64,
                  color: "var(--color-fg-danger-primary)",
                  display: "block",
                }}
              />
            )}
            <Typography
              variant="h5"
              component="span"
              sx={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}
            >
              {modalStatus === "success" ? "¡Correo enviado!" : "Error"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography
            id="forgot-password-modal-description"
            variant="body1"
            color="text.secondary"
          >
            {modalStatus === "success"
              ? "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
              : errorMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pt: 2, pb: 3 }}>
          {modalStatus === "success" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
              sx={{ px: 4, py: 1 }}
            >
              Ir al login
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModal}
              sx={{ px: 4, py: 1 }}
            >
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForgotPassword;
