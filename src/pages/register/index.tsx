import { useFormik } from "formik";
import { validationSchema } from "./validation-schema";

import {
  Box,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Container,
  useTheme,
} from "@mui/material";
import { StyledTextField } from "./styles";
import logo from "../../assets/png/factorlink-logo.png";

const Register = () => {
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      tipoEntidad: "",
      nombre: "",
      apellido: "",
      rut: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
            Registro
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
                <img
                  src={logo}
                  alt="Factorlink Logo"
                  style={{ maxWidth: 250 }}
                />
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              {/* Form Fields */}
              <Box>
                <StyledTextField
                  select
                  fullWidth
                  defaultValue=""
                  label="Tipo de entidad"
                  id="tipoEntidad"
                  name="tipoEntidad"
                  error={
                    formik.touched.tipoEntidad &&
                    Boolean(formik.errors.tipoEntidad)
                  }
                  helperText={
                    formik.touched.tipoEntidad && formik.errors.tipoEntidad
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="EMPRESA">Empresa</MenuItem>
                  <MenuItem value="FACTORING">Factoring</MenuItem>
                </StyledTextField>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nombre"
                  id="nombre"
                  name="nombre"
                  value={formik.values.nombre}
                  error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Apellido"
                  id="apellido"
                  name="apellido"
                  value={formik.values.apellido}
                  error={
                    formik.touched.apellido && Boolean(formik.errors.apellido)
                  }
                  helperText={formik.touched.apellido && formik.errors.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="RUT"
                  id="rut"
                  name="rut"
                  value={formik.values.rut}
                  error={formik.touched.rut && Boolean(formik.errors.rut)}
                  helperText={formik.touched.rut && formik.errors.rut}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  placeholder="Telefono móvil"
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formik.values.telefono}
                  error={
                    formik.touched.telefono && Boolean(formik.errors.telefono)
                  }
                  helperText={formik.touched.telefono && formik.errors.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <StyledTextField
                  fullWidth
                  variant="outlined"
                  type="confirmPassword"
                  placeholder="Confirmar contraseña"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      id="acceptedTerms"
                      name="acceptedTerms"
                      checked={formik.values.acceptedTerms}
                      onChange={formik.handleChange}
                      size="small"
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
                        color: "text.secondary",
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
                        términos y condiciones de uso
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    href="/login"
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
                    Ya tengo cuenta
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
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
                    Crear cuenta
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
