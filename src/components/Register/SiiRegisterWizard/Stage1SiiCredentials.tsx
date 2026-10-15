import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import { StyledTextField } from "../../../pages/register/styles";
import {
  personalRutValidation,
  handleRutInputChange,
} from "../../../utils/validations/shared-fields";
import logo from "../../../assets/png/factorlink-logo.png";
import {
  authCenteredPageTopSx,
  authFormWideSx,
  authLogoImgSx,
  authLogoLinkSx,
  authPrimaryButtonSx,
  authTitleSx,
} from "../../../theme";

interface Stage1FormValues {
  siiRut: string;
  siiPassword: string;
}

interface Stage1SiiCredentialsProps {
  initialRut?: string;
  errorMessage?: string | null;
  onContinue: (values: Stage1FormValues) => void;
}

const stage1Schema = yup.object({
  siiRut: personalRutValidation,
  siiPassword: yup
    .string()
    .required("La contraseña del SII es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const infoBoxSx = {
  display: "flex",
  gap: 1.5,
  alignItems: "flex-start",
  p: 2,
  mb: 3,
  borderRadius: "var(--radius-m)",
  backgroundColor: "var(--color-bg-accent-secondary)",
  color: "var(--color-fg-default-secondary)",
} as const;

const Stage1SiiCredentials = ({
  initialRut = "",
  errorMessage,
  onContinue,
}: Stage1SiiCredentialsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<Stage1FormValues>({
    initialValues: {
      siiRut: initialRut,
      siiPassword: "",
    },
    enableReinitialize: true,
    validationSchema: stage1Schema,
    onSubmit: (values) => {
      onContinue({
        siiRut: values.siiRut.trim(),
        siiPassword: values.siiPassword,
      });
    },
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRutInputChange(e, formik.setFieldValue);
  };

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

      <Box sx={{ ...authFormWideSx, mt: 1 }}>
        <Typography component="h1" sx={{ ...authTitleSx, mb: 1 }}>
          Conecta con el SII
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "var(--color-fg-default-secondary)",
            mb: 3,
            fontSize: "var(--font-size-s)",
          }}
        >
          Usa tus credenciales personales del SII para crear tu cuenta en
          Factorlink.
        </Typography>

        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Box sx={infoBoxSx}>
          <PersonOutlineOutlinedIcon
            sx={{ color: "var(--color-fg-accent-primary)", mt: 0.25 }}
          />
          <Typography sx={{ fontSize: "var(--font-size-s)", lineHeight: 1.5 }}>
            Necesitamos tu RUT personal y tu contraseña del SII (titular de la
            empresa) para obtener automáticamente tus datos y las empresas
            asociadas. Usamos estas credenciales de forma segura para crear y
            vincular tu cuenta.
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="RUT personal del SII"
            placeholder="Ej: 12.345.678-9"
            id="siiRut"
            name="siiRut"
            value={formik.values.siiRut}
            error={formik.touched.siiRut && Boolean(formik.errors.siiRut)}
            helperText={formik.touched.siiRut && formik.errors.siiRut}
            onChange={handleRutChange}
            onBlur={formik.handleBlur}
            autoComplete="username"
          />

          <StyledTextField
            fullWidth
            variant="outlined"
            label="Contraseña del SII"
            placeholder="Ingresa tu contraseña"
            id="siiPassword"
            name="siiPassword"
            type={showPassword ? "text" : "password"}
            value={formik.values.siiPassword}
            error={
              formik.touched.siiPassword && Boolean(formik.errors.siiPassword)
            }
            helperText={
              formik.touched.siiPassword && formik.errors.siiPassword
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="current-password"
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

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              mb: 3,
              mt: 0.5,
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
                backgroundColor: "var(--color-bg-accent-secondary)",
                flexShrink: 0,
              }}
            >
              <LockOutlinedIcon
                sx={{
                  color: "var(--color-fg-accent-primary)",
                  fontSize: 20,
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: "var(--font-size-s)",
                color: "var(--color-fg-accent-primary)",
                lineHeight: 1.5,
              }}
            >
              Utilizamos estas credenciales de forma segura para obtener tu
              información del SII y vincular tu cuenta en Factorlink.
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            sx={{
              ...authPrimaryButtonSx,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "var(--radius-m)",
            }}
          >
            Crear cuenta y continuar
          </Button>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mt: 3,
            color: "var(--color-fg-default-secondary)",
            fontSize: "var(--font-size-xs)",
            lineHeight: 1.5,
          }}
        >
          Debes ser el titular de al menos una empresa en el SII para poder
          crear tu cuenta en Factorlink.
        </Typography>
      </Box>
    </Box>
  );
};

export default Stage1SiiCredentials;
