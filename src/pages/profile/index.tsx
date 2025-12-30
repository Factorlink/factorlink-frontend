import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useUser } from "../../hooks/useUser";
import useAuthStore from "../../store/authStore";

import {
  Box,
  Button,
  Typography,
  Container,
  useTheme,
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

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  lastName: Yup.string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres"),
  phone: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^\+?[0-9]{9,15}$/, "Ingresa un teléfono válido"),
});

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const { updateUserProfile, loading } = useUser();
  const { user } = useAuthStore();

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

  const handleUpdateProfile = async (values: ProfileFormData) => {
    try {
      const response = await updateUserProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
      });
      
      // Update user in store
      useAuthStore.getState().setUser({
        ...user!,
        firstName: response.firstName || values.firstName.trim(),
        lastName: response.lastName || values.lastName.trim(),
        phone: response.phone || values.phone.trim(),
      });
      
      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string[] } } };
      setErrorMessage(axiosError?.response?.data?.message?.[0] || "Ocurrió un error, intenta nuevamente");
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdateProfile(values);
    },
    enableReinitialize: true,
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
            Editar Perfil
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
                <img src={logo} alt="Factorlink Logo" style={{ maxWidth: 250 }} />
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ paddingLeft: { md: 2 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Actualiza tu información personal
              </Typography>

              {/* Form Fields */}
              <Box>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Nombre"
                  placeholder="Nombre"
                  id="firstName"
                  name="firstName"
                  disabled={loading}
                  value={formik.values.firstName}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Apellido"
                  placeholder="Apellido"
                  id="lastName"
                  name="lastName"
                  disabled={loading}
                  value={formik.values.lastName}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/dashboard")}
                    disabled={loading}
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
                    Cancelar
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || !formik.dirty || loading}
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
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle id="profile-modal-title" sx={{ textAlign: "center", px: 3, pt: 3, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {modalStatus === "success" ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "success.main", display: "block" }} />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", display: "block" }} />
            )}
            <Typography variant="h5" fontWeight={600} component="span">
              {modalStatus === "success" ? "¡Perfil actualizado!" : "Error al actualizar"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography id="profile-modal-description" variant="body1" color="text.secondary">
            {modalStatus === "success"
              ? "Tu información ha sido actualizada correctamente."
              : errorMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pt: 2, pb: 3 }}>
          {modalStatus === "success" ? (
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                backgroundColor: "success.main",
                color: "common.white",
                textTransform: "none",
                px: 4,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "success.dark",
                },
              }}
            >
              Continuar
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{
                backgroundColor: "error.main",
                color: "common.white",
                textTransform: "none",
                px: 4,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
            >
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
