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
import { useEmpresa } from "../../hooks/useEmpresa";
import { StyledTextField } from "../../pages/register/styles";
import {
  rutValidation,
  handleRutInputChange,
} from "../../utils/validations/shared-fields";
import useAuthStore from "../../store/authStore";
import siiLogo from "../../assets/png/sii-logo.png";
import { useUsers } from "../../hooks/useUsers";

interface SiiSyncFormData {
  siiRut: string;
  siiPassword: string;
}

interface SiiSyncModalProps {
  open: boolean;
  onClose: () => void;
}

const siiSyncSchema = yup.object({
  siiRut: rutValidation,
  siiPassword: yup
    .string()
    .required("La contraseña del SII es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const SiiSyncModal = ({ open, onClose }: SiiSyncModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, setUser, currentRole } = useAuthStore();
  const { createEmpresaBySii, loading } = useEmpresa();
  const { getMyInfo } = useUsers();

  const isSynced = currentRole?.empresa?.siiSyncEnabled === true;
  const defaultRut = currentRole?.empresa?.siiRut || "";

  const handleSyncSii = async (values: SiiSyncFormData) => {
    try {
      await createEmpresaBySii({
        siiRut: values.siiRut.trim(),
        siiPassword: values.siiPassword,
      });

      const { user: updatedUser } = await getMyInfo();
      setUser({ ...user!, roles: updatedUser.roles });

      setAlertStatus("success");
      setAlertMessage(
        "Los datos de tu empresa han sido sincronizados correctamente con el SII.",
      );
      formik.resetForm();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al sincronizar con el SII",
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
    formik.resetForm();
    onClose();
  };

  const formik = useFormik<SiiSyncFormData>({
    initialValues: {
      siiRut: isSynced ? defaultRut : "",
      siiPassword: "",
    },
    enableReinitialize: true,
    validationSchema: siiSyncSchema,
    onSubmit: handleSyncSii,
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
          borderRadius: "var(--radius-l)",
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
            component="img"
            src={siiLogo}
            alt="Logo SII"
            sx={{
              width: 48,
              height: "auto",
              objectFit: "contain",
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Sincronizar con SII
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert severity={alertStatus} sx={{ mb: 3 }}>
            {alertMessage}
          </Alert>
        )}

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Ingresa las credenciales del SII para sincronizar automáticamente los
          datos de tu empresa.
        </Typography>

        <StyledTextField
          fullWidth
          label="RUT del SII"
          placeholder="12.345.678-9"
          name="siiRut"
          value={formik.values.siiRut}
          error={formik.touched.siiRut && Boolean(formik.errors.siiRut)}
          helperText={formik.touched.siiRut && formik.errors.siiRut}
          onChange={isSynced ? undefined : handleRutChange}
          onBlur={formik.handleBlur}
          disabled={loading || alertStatus === "success"}
          InputProps={{ readOnly: isSynced }}
        />

        <StyledTextField
          fullWidth
          label="Contraseña SII"
          placeholder="Ingresa tu contraseña del SII"
          type={showPassword ? "text" : "password"}
          name="siiPassword"
          inputProps={{ maxLength: 128, autoComplete: "current-password" }}
          value={formik.values.siiPassword}
          error={
            formik.touched.siiPassword && Boolean(formik.errors.siiPassword)
          }
          helperText={formik.touched.siiPassword && formik.errors.siiPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loading || alertStatus === "success"}
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

        <Box
          sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              textTransform: "none",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: 500,
              borderRadius: "var(--radius-m)",
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
                "Sincronizar"
              )}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SiiSyncModal;
