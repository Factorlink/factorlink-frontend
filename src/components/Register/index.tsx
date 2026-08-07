import { useState } from "react";
import { useFormik } from "formik";
import type { FormikProps } from "formik";
import { useNavigate } from "react-router-dom";
import type { RegisterFormData } from "../../types/outgoing/register-form-data";
import { validationSchema } from "../../pages/register/validation-schema";
import { useAuth } from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import { StyledTextField } from "../../pages/register/styles";
import logo from "../../assets/png/factorlink-logo.png";
import {
  handlePhoneInputChange,
  handleNameInputChange,
  handleRutInputChange,
  handlePasswordInputChange,
} from "../../utils/validations/shared-fields";
import {
  authCenteredPageTopSx,
  authCheckboxSx,
  authFooterTextSx,
  authFormWideSx,
  authLinkSx,
  authLogoImgSx,
  authLogoLinkSx,
  authPrimaryButtonSx,
  authTitleSx,
} from "../../theme";

interface RegisterFormProps {
  roleType: string;
  tabLabel: string;
  renderAdditionalFields?: (
    formik: FormikProps<RegisterFormData>,
    loading: boolean,
    handleRutChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => React.ReactNode;
}

const RegisterForm = ({
  roleType,
  tabLabel,
  renderAdditionalFields,
}: RegisterFormProps) => {
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
      roleType,
      firstName: "",
      lastName: "",
      rut: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsConditions: false,
      privacyPolicy: false,
      emailConsent: false,
      factoringRut: "",
      factoringRazonSocial: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

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
    <Box sx={authCenteredPageTopSx}>
      <Box component="a" href="/login" sx={authLogoLinkSx}>
        <Box
          component="img"
          src={logo}
          alt="Factorlink"
          sx={authLogoImgSx}
        />
      </Box>

      <Typography variant="h3" component="h1" sx={authTitleSx}>
        Crea tu cuenta
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "var(--color-fg-default-secondary)",
          mt: -1,
        }}
      >
        Regístrate como {tabLabel}
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        sx={authFormWideSx}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: { sm: 2 },
          }}
        >
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
            helperText={formik.touched.firstName && formik.errors.firstName}
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
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            onChange={handleNameChange}
            onBlur={formik.handleBlur}
          />
        </Box>

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

        {renderAdditionalFields?.(formik, loading, handleRutChange)}

        <StyledTextField
          fullWidth
          variant="outlined"
          type={showPassword ? "text" : "password"}
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          id="password"
          name="password"
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
                  aria-label="toggle confirm password visibility"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  edge="end"
                  disabled={loading}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              sx={{ ...authCheckboxSx, p: 0.5 }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                fontSize: "var(--font-size-s)",
                lineHeight: 1.4,
                color: "text.secondary",
              }}
            >
              He leído y acepto los{" "}
              <Link
                href="/terminos-condiciones"
                target="_blank"
                sx={authLinkSx}
              >
                términos y condiciones de uso
              </Link>
            </Typography>
          }
          sx={{
            mb: 1,
            ml: 0,
            alignItems: "center",
            "& .MuiCheckbox-root": { alignSelf: "center" },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              id="acceptedPrivacy"
              name="privacyPolicy"
              checked={formik.values.privacyPolicy ?? false}
              onChange={formik.handleChange}
              disabled={loading}
              size="small"
              sx={{ ...authCheckboxSx, p: 0.5 }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                fontSize: "var(--font-size-s)",
                lineHeight: 1.4,
                color: "text.secondary",
              }}
            >
              He leído y acepto la{" "}
              <Link
                href="/politica-privacidad"
                target="_blank"
                sx={authLinkSx}
              >
                Política de Privacidad
              </Link>
            </Typography>
          }
          sx={{
            mb: 1,
            ml: 0,
            alignItems: "center",
            "& .MuiCheckbox-root": { alignSelf: "center" },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              id="acceptedEmailConsent"
              name="emailConsent"
              checked={formik.values.emailConsent ?? false}
              onChange={formik.handleChange}
              disabled={loading}
              size="small"
              sx={{ ...authCheckboxSx, p: 0.5 }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                fontSize: "var(--font-size-s)",
                lineHeight: 1.4,
                color: "text.secondary",
              }}
            >
              He leído y acepto{" "}
              <Link
                href="/consentimiento-emails"
                target="_blank"
                sx={authLinkSx}
              >
                recibir comunicaciones por correo electrónico
              </Link>
            </Typography>
          }
          sx={{
            mb: 3,
            ml: 0,
            alignItems: "center",
            "& .MuiCheckbox-root": { alignSelf: "center" },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={!formik.isValid || !formik.dirty || loading}
          sx={authPrimaryButtonSx}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Crear cuenta"
          )}
        </Button>

        <Typography variant="body2" sx={authFooterTextSx}>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" sx={authLinkSx}>
            Inicia sesión
          </Link>
        </Typography>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
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
              color="primary"
              onClick={handleContinue}
              sx={{ px: 4, py: 1 }}
            >
              Continuar
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

export default RegisterForm;
