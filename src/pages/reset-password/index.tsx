import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  authCenteredPageSx,
  authFormSx,
  authLinkSx,
  authLogoImgSx,
  authLogoLinkSx,
  authPrimaryButtonSx,
  authTitleSx,
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
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
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

  const handleResetPassword = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
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
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string[] } };
      };

      if (
        axiosError?.response?.status === 400 ||
        axiosError?.response?.status === 401
      ) {
        setErrorMessage(
          "El enlace de recuperación no es válido o ha expirado."
        );
      } else if (
        axiosError?.response?.status &&
        axiosError.response.status >= 500
      ) {
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
      <Box sx={authCenteredPageSx}>
        <Box component="a" href="/login" sx={authLogoLinkSx}>
          <Box
            component="img"
            src={logo}
            alt="Factorlink"
            sx={authLogoImgSx}
          />
        </Box>

        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: "var(--color-fg-danger-primary)",
          }}
        />

        <Typography variant="h3" component="h1" sx={authTitleSx}>
          Enlace inválido
        </Typography>

        <Box sx={{ ...authFormSx, alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mb: 3,
              color: "var(--color-fg-default-secondary)",
            }}
          >
            El enlace de recuperación no es válido o ha expirado.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            href="/forgot-password"
            sx={authPrimaryButtonSx}
          >
            Solicitar nuevo enlace
          </Button>
        </Box>
      </Box>
    );
  }

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
        Restablece tu contraseña
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
          Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
        </Typography>

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
                  aria-label="toggle password visibility"
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
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          onChange={handlePasswordChange}
          onBlur={formik.handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  disabled={loading}
                  aria-label="toggle confirm password visibility"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
            "Restablecer"
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
        <DialogTitle
          id="reset-password-modal-title"
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
              {modalStatus === "success"
                ? "¡Contraseña actualizada!"
                : "Error"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography
            id="reset-password-modal-description"
            variant="body1"
            color="text.secondary"
          >
            {modalStatus === "success"
              ? "Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña."
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ px: 3, py: 1 }}
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="/forgot-password"
                sx={{ px: 3, py: 1 }}
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
