import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useUser } from "../../../hooks/useUser";
import {
  passwordValidation,
  handlePasswordInputChange,
} from "../../../utils/validations/shared-fields";

import {
  Box,
  Button,
  Typography,
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
import { StyledTextField } from "../../../pages/register/styles";
import { surface } from "../../../theme";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("La contraseña actual es obligatoria"),
  newPassword: passwordValidation,
  confirmNewPassword: yup
    .string()
    .required("Confirmar contraseña es obligatorio")
    .oneOf([yup.ref("newPassword")], "Las contraseñas deben coincidir"),
});

const ChangePassword = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword, loading } = useUser();

  const handleCloseModal = (
    _event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setModalOpen(false);
  };

  const handleContinue = () => {
    setModalOpen(false);
  };

  const handleChangePassword = async (values: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setModalStatus("success");
      setModalOpen(true);
      formik.resetForm();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string[] } };
      };
      
      if (axiosError?.response?.status === 401) {
        setErrorMessage("La contraseña actual es incorrecta");
      } else {
        setErrorMessage(
          axiosError?.response?.data?.message?.[0] ||
            "Ocurrió un error, intenta nuevamente"
        );
      }
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const formik = useFormik<ChangePasswordFormData>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: (values) => {
      handleChangePassword(values);
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePasswordInputChange(e, formik.setFieldValue);
  };

  return (
    <>
      <Box
        sx={{
          ...surface.card,
          overflow: "hidden",
        }}
      >
          <Box
            sx={{
              display: "grid",
              padding: { xs: 3, md: 5 },
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ paddingLeft: { md: 2 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Cambiar contraseña
              </Typography>

              <Box>
                {/* Contraseña actual */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Contraseña actual"
                  placeholder="Ingresa tu contraseña actual"
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  inputProps={{ maxLength: 128, autoComplete: "current-password" }}
                  disabled={loading}
                  value={formik.values.currentPassword}
                  error={
                    formik.touched.currentPassword &&
                    Boolean(formik.errors.currentPassword)
                  }
                  helperText={
                    formik.touched.currentPassword && formik.errors.currentPassword
                  }
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Nueva contraseña */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Nueva contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  inputProps={{ maxLength: 128, autoComplete: "new-password" }}
                  disabled={loading}
                  value={formik.values.newPassword}
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                  onChange={handlePasswordChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirmar nueva contraseña */}
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Confirmar nueva contraseña"
                  placeholder="Confirma tu nueva contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  inputProps={{ maxLength: 128, autoComplete: "new-password" }}
                  disabled={loading}
                  value={formik.values.confirmNewPassword}
                  error={
                    formik.touched.confirmNewPassword &&
                    Boolean(formik.errors.confirmNewPassword)
                  }
                  helperText={
                    formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
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
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => formik.resetForm()}
                    disabled={loading || !formik.dirty}
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "white",
                      textTransform: "none",
                      padding: "12px 24px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: "var(--radius-m)",
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
                    type="submit"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || !formik.dirty || loading}
                    sx={{
                      backgroundColor: "success.main",
                      color: "white",
                      textTransform: "none",
                      padding: "12px 24px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: "var(--radius-m)",
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
                      "Cambiar contraseña"
                    )}
                  </Button>
                </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="change-password-modal-title"
        aria-describedby="change-password-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="change-password-modal-title"
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
                sx={{ fontSize: 64, color: "success.main", display: "block" }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ fontSize: 64, color: "error.main", display: "block" }}
              />
            )}
            <Typography variant="h5" fontWeight={600} component="span">
              {modalStatus === "success"
                ? "¡Contraseña actualizada!"
                : "Error al cambiar contraseña"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, py: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {modalStatus === "success"
              ? "Tu contraseña ha sido cambiada exitosamente."
              : errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleContinue}
            sx={{
              backgroundColor:
                modalStatus === "success" ? "success.main" : "primary.main",
              color: "white",
              textTransform: "none",
              padding: "10px 32px",
              fontSize: "1rem",
              fontWeight: 500,
              borderRadius: "var(--radius-m)",
              "&:hover": {
                backgroundColor:
                  modalStatus === "success" ? "success.dark" : "primary.dark",
              },
            }}
          >
            {modalStatus === "success" ? "Continuar" : "Cerrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangePassword;
