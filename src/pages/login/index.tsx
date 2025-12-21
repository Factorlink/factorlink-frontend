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
import logo from "../../assets/png/factorlink-logo.png";
import siiLogo from "../../assets/png/sii-logo.png";

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
                {/* Diamond Logo */}
                <img
                  src={logo}
                  alt="Factorlink Logo"
                  style={{ maxWidth: 250 }}
                />
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              {/* SII Logo and Description */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 3,
                }}
              >
                {/* SII Logo */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <img src={siiLogo} alt="SII Logo" style={{ maxWidth: 150 }} />
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
                    href="/dashboard"
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
