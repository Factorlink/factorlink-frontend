import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router-dom";
import { StyledTextField } from "../../../pages/register/styles";
import {
  emailValidation,
  phoneValidation,
  passwordValidation,
  confirmPasswordValidation,
  handlePhoneInputChange,
  handlePasswordInputChange,
} from "../../../utils/validations/shared-fields";
import { useAuth } from "../../../hooks/useAuth";
import useAuthStore from "../../../store/authStore";
import { ROLES } from "../../../utils/consts";
import type { RegisterFormData } from "../../../types/outgoing/register-form-data";
import type { ValidatedSiiData } from "./types";
import logo from "../../../assets/png/factorlink-logo.png";
import {
  authCenteredPageTopSx,
  authCheckboxSx,
  authFormWideSx,
  authLinkSx,
  authLogoImgSx,
  authLogoLinkSx,
  authPrimaryButtonSx,
  authTitleSx,
} from "../../../theme";

type PasswordMode = "sii" | "new";

interface Stage3FormValues {
  email: string;
  phone: string;
  passwordMode: PasswordMode;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface Stage3CompleteAccountProps {
  validatedData: ValidatedSiiData;
  /** SII password kept in wizard memory only — used when passwordMode === "sii". */
  siiPassword: string;
  onRegistered: () => void;
}

const stage3Schema = yup.object({
  email: emailValidation,
  phone: phoneValidation,
  passwordMode: yup.mixed<PasswordMode>().oneOf(["sii", "new"]).required(),
  password: yup.string().when("passwordMode", {
    is: "new",
    then: () => passwordValidation,
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: yup.string().when("passwordMode", {
    is: "new",
    then: () => confirmPasswordValidation,
    otherwise: (schema) => schema.notRequired(),
  }),
  termsAccepted: yup
    .boolean()
    .oneOf(
      [true],
      "Debes aceptar los términos, la política de privacidad y recibir comunicaciones",
    )
    .required(),
});

/** Matches read-only fields in Empresa / SiiPersonalSync edit forms. */
const readOnlyFieldSx = {
  "& .MuiInputBase-input": {
    color: "text.secondary",
    cursor: "default",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "action.hover",
  },
} as const;

const sectionTitleSx = {
  fontWeight: 600,
  fontSize: "var(--font-size-m)",
  color: "var(--color-fg-default-primary)",
  mb: 2,
} as const;

const Stage3CompleteAccount = ({
  validatedData,
  siiPassword,
  onRegistered,
}: Stage3CompleteAccountProps) => {
  const navigate = useNavigate();
  const { register, login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");

  const fullName = [validatedData.firstName, validatedData.lastName]
    .filter(Boolean)
    .join(" ");

  const handleCloseModal = (
    _event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setModalOpen(false);
  };

  const handleContinue = () => {
    setModalOpen(false);
    onRegistered();
    navigate("/dashboard");
  };

  const formik = useFormik<Stage3FormValues>({
    initialValues: {
      email: validatedData.email ?? "",
      phone: "",
      passwordMode: "sii",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: stage3Schema,
    onSubmit: async (values) => {
      const password =
        values.passwordMode === "sii" ? siiPassword : values.password;

      if (!password) {
        setErrorMessage(
          "No hay contraseña disponible. Vuelve a conectar con el SII.",
        );
        setModalStatus("error");
        setModalOpen(true);
        return;
      }

      const payload: RegisterFormData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        rut: validatedData.rut,
        email: values.email.trim(),
        phone: values.phone.trim(),
        direccion: validatedData.direccion ?? "",
        password,
        confirmPassword: password,
        termsConditions: values.termsAccepted,
        privacyPolicy: values.termsAccepted,
        emailConsent: values.termsAccepted,
        roleType: ROLES.EMPRESA_ADMIN,
        password_sii_personal: siiPassword,
        empresas: (validatedData.empresas ?? []).map((empresa) => ({
          rut: empresa.rut,
          nombreSociedad: empresa.nombreSociedad ?? empresa.razonSocial,
        })),
      };

      try {
        await register(payload);
        const response = await login({
          email: payload.email,
          password: payload.password,
        });

        if (response.user.roles.length === 1) {
          useAuthStore.getState().setCurrentRole(response.user.roles[0]);
        }

        useAuthStore.getState().setAccessToken(response.accessToken);
        useAuthStore.getState().setRefreshToken(response.refreshToken);
        useAuthStore.getState().setUser(response.user);

        setModalStatus("success");
        setModalOpen(true);
      } catch (error: unknown) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        setErrorMessage(
          axiosError?.response?.data?.message ||
            "Ocurrió un error al completar el registro. Intenta nuevamente.",
        );
        setModalStatus("error");
        setModalOpen(true);
      }
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneInputChange(e, formik.setFieldValue);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePasswordInputChange(e, formik.setFieldValue);
  };

  const canSubmit =
    formik.isValid && formik.values.termsAccepted && !loading;

  return (
    <Box sx={authCenteredPageTopSx}>
      <Box
        component={RouterLink}
        to="/login"
        sx={authLogoLinkSx}
        aria-label="Ir a inicio de sesión"
      >
        <Box component="img" src={logo} alt="factorlink" sx={authLogoImgSx} />
      </Box>

      <Box
        sx={{
          ...authFormWideSx,
          maxWidth: 520,
          mt: 1,
          bgcolor: "var(--color-bg-default-primary)",
          borderRadius: "var(--radius-l)",
          boxShadow: "var(--shadow-popover)",
          border: "1px solid var(--color-border-default-primary)",
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Typography component="h1" sx={{ ...authTitleSx, mb: 1 }}>
          Completa tu cuenta
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "var(--color-fg-default-secondary)",
            mb: 3,
            fontSize: "var(--font-size-s)",
          }}
        >
          Hemos obtenido la siguiente información desde el SII. Revisa y
          completa los datos faltantes.
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column" }}
        >
          {/* Datos del SII */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography sx={{ ...sectionTitleSx, mb: 0 }}>
              Tus datos (obtenidos del SII)
            </Typography>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
              label="Datos verificados"
              size="small"
              sx={{
                bgcolor: "var(--color-bg-success-secondary)",
                color: "var(--color-fg-success-primary)",
                fontWeight: 500,
                fontSize: "var(--font-size-xs)",
                "& .MuiChip-icon": {
                  color: "var(--color-fg-success-primary)",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 0,
              columnGap: 2,
            }}
          >
            <StyledTextField
              fullWidth
              variant="outlined"
              label="RUT personal"
              value={validatedData.rut}
              InputProps={{ readOnly: true }}
              sx={readOnlyFieldSx}
            />
            <StyledTextField
              fullWidth
              variant="outlined"
              label="Nombre completo"
              value={fullName}
              InputProps={{ readOnly: true }}
              sx={readOnlyFieldSx}
            />
          </Box>

          <StyledTextField
            fullWidth
            variant="outlined"
            label="Correo electrónico"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
            autoComplete="email"
          />

          <StyledTextField
            fullWidth
            variant="outlined"
            label="Dirección"
            value={validatedData.direccion ?? ""}
            InputProps={{ readOnly: true }}
            multiline
            minRows={2}
            sx={readOnlyFieldSx}
          />

          {/* Información adicional */}
          <Typography sx={{ ...sectionTitleSx, mt: 1 }}>
            Información adicional
          </Typography>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Teléfono móvil"
            placeholder="Ej: +56 9 1234 5678"
            id="phone"
            name="phone"
            value={formik.values.phone}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            onChange={handlePhoneChange}
            onBlur={formik.handleBlur}
            disabled={loading}
            autoComplete="tel"
          />

          {/* Contraseña */}
          <Typography sx={{ ...sectionTitleSx, mt: 1 }}>
            Contraseña para Factorlink
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              p: 2,
              mb: 2,
              borderRadius: "var(--radius-m)",
              backgroundColor: "var(--color-bg-accent-secondary)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "var(--radius-s)",
                backgroundColor: "var(--color-bg-default-primary)",
                flexShrink: 0,
              }}
            >
              <LockOutlinedIcon
                sx={{ color: "var(--color-fg-accent-primary)", fontSize: 20 }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: "var(--font-size-s)",
                color: "var(--color-fg-default-secondary)",
                lineHeight: 1.5,
              }}
            >
              Puedes usar la misma contraseña de tu SII o crear una nueva
              contraseña para acceder a tu cuenta en Factorlink.
            </Typography>
          </Box>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              name="passwordMode"
              value={formik.values.passwordMode}
              onChange={(e) => {
                const mode = e.target.value as PasswordMode;
                void formik.setFieldValue("passwordMode", mode);
                if (mode === "sii") {
                  void formik.setFieldValue("password", "");
                  void formik.setFieldValue("confirmPassword", "");
                }
              }}
            >
              <FormControlLabel
                value="sii"
                control={<Radio sx={authCheckboxSx} disabled={loading} />}
                disabled={loading}
                sx={{ alignItems: "flex-start", mb: 1 }}
                label={
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "var(--font-size-s)" }}>
                      Usar la misma contraseña del SII
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--color-fg-default-secondary)",
                      }}
                    >
                      Tu contraseña del SII también será tu contraseña para
                      Factorlink.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="new"
                control={<Radio sx={authCheckboxSx} disabled={loading} />}
                disabled={loading}
                sx={{ alignItems: "flex-start" }}
                label={
                  <Box sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "var(--font-size-s)" }}>
                      Crear una nueva contraseña
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--color-fg-default-secondary)",
                      }}
                    >
                      Define una contraseña diferente para acceder a tu cuenta.
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          {formik.values.passwordMode === "new" ? (
            <>
              <StyledTextField
                fullWidth
                variant="outlined"
                label="Nueva contraseña"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                onChange={handlePasswordChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
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
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
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
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        edge="end"
                        size="small"
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
            </>
          ) : null}

          <FormControlLabel
            sx={{ alignItems: "flex-start", mb: 2, mt: 1 }}
            control={
              <Checkbox
                id="termsAccepted"
                name="termsAccepted"
                checked={formik.values.termsAccepted}
                onChange={formik.handleChange}
                disabled={loading}
                sx={{ ...authCheckboxSx, pt: 0 }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: "var(--font-size-s)",
                  color: "var(--color-fg-default-secondary)",
                }}
              >
                He leído y acepto los{" "}
                <Link
                  component={RouterLink}
                  to="/terminos-condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={authLinkSx}
                >
                  términos y condiciones de uso
                </Link>
                , la{" "}
                <Link
                  component={RouterLink}
                  to="/politica-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={authLinkSx}
                >
                  Política de Privacidad
                </Link>{" "}
                y{" "}
                <Link
                  component={RouterLink}
                  to="/consentimiento-emails"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={authLinkSx}
                >
                  recibir comunicaciones por correo electrónico
                </Link>
              </Typography>
            }
          />
          {formik.touched.termsAccepted && formik.errors.termsAccepted ? (
            <Typography
              color="error"
              sx={{ fontSize: "var(--font-size-xs)", mb: 1, mt: -1 }}
            >
              {formik.errors.termsAccepted}
            </Typography>
          ) : null}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!canSubmit}
            sx={{
              ...authPrimaryButtonSx,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "var(--radius-m)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Completar registro"
            )}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        PaperProps={{
          sx: { borderRadius: "var(--radius-l)", minWidth: 320 },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          {modalStatus === "success" ? (
            <CheckCircleOutlineIcon
              sx={{ fontSize: 64, color: "success.main", display: "block", mx: "auto" }}
            />
          ) : (
            <ErrorOutlineIcon
              sx={{ fontSize: 64, color: "error.main", display: "block", mx: "auto" }}
            />
          )}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {modalStatus === "success"
              ? "¡Registro exitoso!"
              : "No se pudo completar el registro"}
          </Typography>
          {modalStatus === "error" ? (
            <Typography color="text.secondary">{errorMessage}</Typography>
          ) : (
            <Typography color="text.secondary">
              Tu cuenta fue creada correctamente. Continúa para ir al
              dashboard.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, px: 3 }}>
          {modalStatus === "success" ? (
            <Button
              fullWidth
              variant="contained"
              onClick={handleContinue}
              sx={authPrimaryButtonSx}
            >
              Continuar
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => setModalOpen(false)}
              sx={authPrimaryButtonSx}
            >
              Entendido
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Stage3CompleteAccount;
