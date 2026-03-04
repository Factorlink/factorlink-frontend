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
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
import { useEmpresa } from "../../hooks/useEmpresa";
import { StyledTextField } from "../../pages/register/styles";
import {
  rutValidation,
  handleRutInputChange,
} from "../../utils/validations/shared-fields";
import useAuthStore from "../../store/authStore";
import type { Role } from "../../types/role";

interface SiiPersonalSyncFormData {
  siiRutPersonal: string;
  siiPasswordPersonal: string;
  siiPasswordCertificadoPersonal: string;
}

interface SiiPersonalSyncModalProps {
  open: boolean;
  onClose: () => void;
  isUpdate?: boolean;
}

const siiPersonalSyncSchema = yup.object({
  siiRutPersonal: rutValidation,
  siiPasswordPersonal: yup
    .string()
    .required("La contraseña del SII es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
  siiPasswordCertificadoPersonal: yup
    .string()
    .required("La contraseña del certificado es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const SiiPersonalSyncModal = ({
  open,
  onClose,
  isUpdate = false,
}: SiiPersonalSyncModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [showPasswordSii, setShowPasswordSii] = useState(false);
  const [showPasswordCert, setShowPasswordCert] = useState(false);

  const { currentRole } = useAuthStore();
  const { syncPersonalDataSii, loading } = useEmpresa();

  const handleSubmit = async (values: SiiPersonalSyncFormData) => {
    try {
      const empresaId = currentRole?.empresaId || "";
      const response = await syncPersonalDataSii(empresaId, {
        siiRutPersonal: values.siiRutPersonal.trim(),
        siiPasswordPersonal: values.siiPasswordPersonal,
        siiPasswordCertificadoPersonal: values.siiPasswordCertificadoPersonal,
      });

      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        empresa: response,
      } as Role);

      setAlertStatus("success");
      setAlertMessage(
        isUpdate
          ? "Las credenciales personales del SII han sido actualizadas correctamente."
          : "Tu cuenta personal del SII ha sido vinculada correctamente.",
      );
      formik.resetForm();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al vincular la cuenta personal del SII",
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
    setShowPasswordSii(false);
    setShowPasswordCert(false);
    formik.resetForm();
    onClose();
  };

  const formik = useFormik<SiiPersonalSyncFormData>({
    initialValues: {
      siiRutPersonal: "",
      siiPasswordPersonal: "",
      siiPasswordCertificadoPersonal: "",
    },
    validationSchema: siiPersonalSyncSchema,
    onSubmit: handleSubmit,
  });

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRutInputChange(e, formik.setFieldValue);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SyncIcon sx={{ color: "common.white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {isUpdate
              ? "Actualizar cuenta personal SII"
              : "Vincular cuenta personal SII"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert
            severity={alertStatus}
            sx={{ mb: 3 }}
            onClose={() => {
              setAlertStatus(null);
              setAlertMessage("");
            }}
          >
            {alertMessage}
          </Alert>
        )}

        {alertStatus !== "success" && (
          <>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              {isUpdate
                ? "Actualiza las credenciales de tu cuenta personal del SII."
                : "Ingresa las credenciales de tu cuenta personal del SII para habilitar las funcionalidades avanzadas."}
            </Typography>

            <StyledTextField
              fullWidth
              label="RUT Personal"
              placeholder="12.345.678-9"
              name="siiRutPersonal"
              value={formik.values.siiRutPersonal}
              error={
                formik.touched.siiRutPersonal &&
                Boolean(formik.errors.siiRutPersonal)
              }
              helperText={
                formik.touched.siiRutPersonal && formik.errors.siiRutPersonal
              }
              onChange={handleRutChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <StyledTextField
              fullWidth
              label="Contraseña SII"
              placeholder="Ingresa tu contraseña del SII"
              type={showPasswordSii ? "text" : "password"}
              name="siiPasswordPersonal"
              inputProps={{ maxLength: 128, autoComplete: "current-password" }}
              value={formik.values.siiPasswordPersonal}
              error={
                formik.touched.siiPasswordPersonal &&
                Boolean(formik.errors.siiPasswordPersonal)
              }
              helperText={
                formik.touched.siiPasswordPersonal &&
                formik.errors.siiPasswordPersonal
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswordSii(!showPasswordSii)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPasswordSii ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              label="Contraseña del Certificado Digital"
              placeholder="Ingresa la contraseña de tu certificado"
              type={showPasswordCert ? "text" : "password"}
              name="siiPasswordCertificadoPersonal"
              inputProps={{ maxLength: 128, autoComplete: "current-password" }}
              value={formik.values.siiPasswordCertificadoPersonal}
              error={
                formik.touched.siiPasswordCertificadoPersonal &&
                Boolean(formik.errors.siiPasswordCertificadoPersonal)
              }
              helperText={
                formik.touched.siiPasswordCertificadoPersonal &&
                formik.errors.siiPasswordCertificadoPersonal
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswordCert(!showPasswordCert)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPasswordCert ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}

        <Box
          sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            disabled={loading}
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
            {alertStatus === "success" ? "Cerrar" : "Cancelar"}
          </Button>

          {alertStatus !== "success" && (
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
              ) : isUpdate ? (
                "Actualizar"
              ) : (
                "Vincular"
              )}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SiiPersonalSyncModal;
