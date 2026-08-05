import { useState, useEffect } from "react";
import {
  Box,
  TextField,
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
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import logo from "../../assets/png/factorlink-logo.png";
import { useAuth } from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";
import { loginValidationSchema } from "./validation-schema";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  authCenteredPageSx,
  authFooterTextSx,
  authFormSx,
  authLinkSx,
  authLogoImgSx,
  authLogoLinkSx,
  authPrimaryButtonSx,
  authTitleSx,
} from "../../theme";

// Mapeo de errores del backend a mensajes amigables
const mapLoginError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = axiosError.response?.status;

    switch (status) {
      case 401:
        return (
          axiosError.response?.data?.message || "Email o contraseña incorrectos"
        );
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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuth();
  const { accessToken, user } = useAuthStore();

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
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await login({
          email: values.email.trim().toLowerCase(),
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
        setModalStatus("error");
        setErrorMessage(mapLoginError(error));
        setModalOpen(true);
      }
    },
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalStatus === "success") {
      if (user?.roles.length === 1) {
        navigate("/dashboard");
      } else {
        navigate("/role-selection");
      }
    }
  };

  return (
    <Box sx={authCenteredPageSx}>
      <Box component="a" href="/" sx={authLogoLinkSx}>
        <Box
          component="img"
          src={logo}
          alt="Factorlink"
          sx={authLogoImgSx}
        />
      </Box>

      <Typography variant="h3" component="h1" sx={authTitleSx}>
        Entra a tu cuenta
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        sx={authFormSx}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          name="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          variant="outlined"
          type={showPassword ? "text" : "password"}
          label="Contraseña"
          placeholder="Contraseña"
          name="password"
          inputProps={{
            maxLength: 128,
            autoComplete: "current-password",
          }}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          disabled={loading}
          sx={{ mb: 3 }}
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

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading || !formik.isValid || !formik.dirty}
          sx={authPrimaryButtonSx}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Entrar"
          )}
        </Button>

        <Link
          href="/forgot-password"
          sx={{
            ...authLinkSx,
            display: "block",
            textAlign: "center",
            mt: 2.5,
          }}
        >
          Olvidé mi contraseña
        </Link>

        <Typography variant="body2" sx={authFooterTextSx}>
          ¿No tienes una cuenta?{" "}
          <Link href="/register" sx={authLinkSx}>
            Crea una aquí
          </Link>
        </Typography>
      </Box>

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
            borderRadius: "var(--radius-l)",
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
                sx={{ fontSize: 48, color: "var(--color-fg-success-primary)" }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ fontSize: 48, color: "var(--color-fg-danger-primary)" }}
              />
            )}
            <Typography
              variant="h6"
              component="span"
              sx={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}
            >
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
            color={modalStatus === "success" ? "primary" : "error"}
            onClick={handleCloseModal}
            sx={{ px: 4 }}
          >
            {modalStatus === "success" ? "Continuar" : "Cerrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
