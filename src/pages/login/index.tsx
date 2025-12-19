import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Container,
  useTheme,
} from "@mui/material";

const Login = () => {
  const theme = useTheme();
  const [rut, setRut] = useState("76.453.189-2");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
          {/* Suite Empresa Tab */}
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
            Suite Empresa
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
                borderRight: { xs: "none", md: `1px solid ${theme.palette.divider}` },
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
                {/* Diamond Logo */}
                <Box sx={{ position: "relative", width: 45, height: 45 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      width: 30,
                      height: 30,
                      border: `3px solid ${theme.palette.primary.main}`,
                      transform: "rotate(45deg)",
                      top: 0,
                      left: 8,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      width: 30,
                      height: 30,
                      border: `3px solid ${theme.palette.primary.main}`,
                      transform: "rotate(45deg)",
                      top: 12,
                      left: 8,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: "2rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  <span style={{ color: theme.palette.primary.main }}>factor</span>
                  <span style={{ fontWeight: 500, color: theme.palette.text.secondary }}>link</span>
                </Typography>
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              {/* SII Logo and Description */}
              <Box
                sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}
              >
                {/* SII Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "2.2rem",
                      color: "primary.dark",
                      lineHeight: 1,
                    }}
                  >
                    Sii
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "primary.dark",
                        lineHeight: 1.2,
                      }}
                    >
                      Servicio de
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "error.main",
                        lineHeight: 1.2,
                      }}
                    >
                      Impuestos
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "primary.dark",
                        lineHeight: 1.2,
                      }}
                    >
                      Internos
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    flex: 1,
                  }}
                >
                  Ingresa tu rut y contraseña de SII para sincronizar la
                  información de tus facturas.
                  <br />
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
                    Más detalles del proceso.
                  </Link>
                </Typography>
              </Box>

              {/* Form Fields */}
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="76.453.189-2"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                      "& fieldset": {
                        borderColor: "divider",
                      },
                      "&:hover fieldset": {
                        borderColor: "text.disabled",
                      },
                      "& input": {
                        color: "text.secondary",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                      "& fieldset": {
                        borderColor: "divider",
                      },
                      "&:hover fieldset": {
                        borderColor: "text.disabled",
                      },
                      "& input::placeholder": {
                        color: "text.disabled",
                        opacity: 1,
                      },
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
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
                        términos de SII
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
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
                    Cerrar Sesión
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
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
                    Siguiente
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

export default Login;
