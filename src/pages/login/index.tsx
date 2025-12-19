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
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.primary.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              padding: "12px 24px",
              width: "fit-content",
              borderRadius: "0 0 16px 0",
              fontWeight: 500,
              fontSize: "0.95rem",
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(45deg)",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "white",
                      borderRadius: 0.5,
                      transform: "rotate(-45deg)",
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 400,
                    color: theme.palette.primary.main,
                    fontSize: "1.8rem",
                  }}
                >
                  <span style={{ fontWeight: 300 }}>factor</span>
                  <span
                    style={{
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    link
                  </span>
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                borderLeft: {
                  xs: "none",
                  md: `1px solid ${theme.palette.divider}`,
                },
                paddingLeft: { md: 4 },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 24,
                      backgroundColor: theme.palette.error.main,
                      borderRadius: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 24,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 0.5,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 24,
                      backgroundColor: theme.palette.warning.main,
                      borderRadius: 0.5,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: "0.85rem",
                  }}
                >
                  Servicio de
                  <br />
                  Impuestos
                  <br />
                  Internos
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: theme.palette.text.primary,
                  lineHeight: 1.5,
                }}
              >
                Ingresa tu rut y contraseña de SII para sincronizar la
                información de tus facturas.
              </Typography>

              <Link
                href="#"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  mb: 3,
                  display: "inline-block",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Más detalles del proceso
              </Link>

              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rut Empresa"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.secondary,
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
                      backgroundColor: theme.palette.background.default,
                      "& fieldset": {
                        borderColor: theme.palette.divider,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.text.secondary,
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
                        color: theme.palette.text.disabled,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      He leído y acepto los{" "}
                      <Link
                        href="#"
                        sx={{
                          color: theme.palette.primary.main,
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
                      backgroundColor: theme.palette.secondary.main,
                      color: "white",
                      textTransform: "none",
                      padding: "10px",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.dark,
                      },
                    }}
                  >
                    Cerrar Sesión
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: theme.palette.success.main,
                      color: "white",
                      textTransform: "none",
                      padding: "10px",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.success.dark,
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
