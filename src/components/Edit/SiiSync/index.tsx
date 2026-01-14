import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
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
import { useEmpresa } from "../../../hooks/useEmpresa";
import { StyledTextField } from "../../../pages/register/styles";
import {
  rutValidation,
  handleRutInputChange,
} from "../../../utils/validations/shared-fields";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";
import siiLogo from "../../../assets/png/sii-logo.png";

interface SiiSyncFormData {
  siiRut: string;
  siiPassword: string;
}

const siiSyncSchema = yup.object({
  siiRut: rutValidation,
  siiPassword: yup
    .string()
    .required("La contraseña del SII es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const SiiSync = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { currentRole } = useAuthStore();
  const { createEmpresaBySii, loading } = useEmpresa();

  const handleSyncSii = async (values: SiiSyncFormData) => {
    try {
      const response = await createEmpresaBySii({
        siiRut: values.siiRut.trim(),
        siiPassword: values.siiPassword,
      });

      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        empresaId: response.id,
        nivel: 2,
        empresa: response,
      } as Role);

      setModalStatus("success");
      setModalOpen(true);
      formik.resetForm();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al sincronizar con el SII"
      );
      setModalStatus("error");
      setModalOpen(true);
    }
  };

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

  const formik = useFormik<SiiSyncFormData>({
    initialValues: {
      siiRut: "",
      siiPassword: "",
    },
    validationSchema: siiSyncSchema,
    onSubmit: handleSyncSii,
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRutInputChange(e, formik.setFieldValue);
  };

  return (
    <>
      <Box
        id="sii-sync-card"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: { xs: 3, md: 5 },
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
            >
              Sincronizar con SII
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 3 }}
            >
              Ingresa las credenciales del SII para sincronizar automáticamente
              los datos de tu empresa.
            </Typography>

            <StyledTextField
              fullWidth
              label="RUT del SII"
              placeholder="12.345.678-9"
              name="siiRut"
              value={formik.values.siiRut}
              error={formik.touched.siiRut && Boolean(formik.errors.siiRut)}
              helperText={formik.touched.siiRut && formik.errors.siiRut}
              onChange={handleRutChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <StyledTextField
              fullWidth
              label="Contraseña SII"
              placeholder="Ingresa tu contraseña del SII"
              type={showPassword ? "text" : "password"}
              name="siiPassword"
              value={formik.values.siiPassword}
              error={
                formik.touched.siiPassword && Boolean(formik.errors.siiPassword)
              }
              helperText={formik.touched.siiPassword && formik.errors.siiPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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
                onClick={() => formik.handleSubmit()}
                disabled={loading || !formik.isValid || !formik.dirty}
                sx={{
                  backgroundColor: "success.main",
                  color: "white",
                  textTransform: "none",
                  padding: "12px 24px",
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
                  "Sincronizar"
                )}
              </Button>
            </Box>
          </Box>

          <Box
            component="img"
            src={siiLogo}
            alt="Logo SII"
            sx={{
              width: { xs: 60, md: 80 },
              height: "auto",
              objectFit: "contain",
              ml: 3,
            }}
          />
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 360,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", px: 3, pt: 3, pb: 1 }}>
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
                sx={{ fontSize: 64, color: "success.main" }}
              />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />
            )}
            <Typography variant="h5" fontWeight={600}>
              {modalStatus === "success"
                ? "¡Sincronización exitosa!"
                : "Error al sincronizar"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography variant="body1" color="text.secondary">
            {modalStatus === "success"
              ? "Los datos de tu empresa han sido sincronizados correctamente con el SII."
              : errorMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pt: 2, pb: 3 }}>
          <Button
            variant="contained"
            onClick={
              modalStatus === "success" ? handleContinue : handleCloseModal
            }
            sx={{
              backgroundColor:
                modalStatus === "success" ? "success.main" : "error.main",
              color: "common.white",
              textTransform: "none",
              px: 4,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor:
                  modalStatus === "success" ? "success.dark" : "error.dark",
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

export default SiiSync;
