import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import useAuthStore from "../../store/authStore";
import { useEmpresa } from "../../hooks/useEmpresa";
import { useUsers } from "../../hooks/useUsers";
import { StyledTextField } from "../../pages/register/styles";
import { rutValidation } from "../../utils/validations/shared-fields";
import type { Role } from "../../types/role";
import siiLogo from "../../assets/png/sii-logo.png";

interface SiiSyncFormData {
  siiRut: string;
  siiPassword: string;
}

const readOnlyFieldSx = {
  "& .MuiInputBase-input": {
    color: "text.secondary",
    cursor: "default",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "action.hover",
  },
} as const;

const siiSyncSchema = yup.object({
  siiRut: rutValidation,
  siiPassword: yup
    .string()
    .required("La contraseña del SII es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const needsEmpresaSiiSync = (role: Role | null | undefined) =>
  Boolean(
    role &&
      role.contexto === "empresa" &&
      (!role.empresaId || role.empresa?.estadoEnrolamiento === "PENDIENTE"),
  );

const SiiSyncPromptModal = () => {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, currentRole, setUser, setCurrentRole } = useAuthStore();
  const { createEmpresaBySii, loading } = useEmpresa();
  const { getMyInfo } = useUsers();
  const navigate = useNavigate();
  const location = useLocation();

  const empresaRut =
    currentRole?.empresa?.rut || currentRole?.empresa?.siiRut || "";

  useEffect(() => {
    if (location.pathname === "/edit/empresa") {
      setOpen(false);
      return;
    }

    if (needsEmpresaSiiSync(currentRole)) {
      setOpen(true);
      setAlertStatus(null);
      setAlertMessage("");
    } else {
      setOpen(false);
    }
  }, [currentRole, location.pathname]);

  const handleSyncSii = async (values: SiiSyncFormData) => {
    try {
      const syncedEmpresa = await createEmpresaBySii({
        siiRut: values.siiRut.trim(),
        siiPassword: values.siiPassword,
      });

      const { user: updatedUser } = await getMyInfo();
      setUser({ ...user!, ...updatedUser, roles: updatedUser.roles });

      const previousEmpresaId = currentRole?.empresaId;
      const syncedEmpresaId =
        syncedEmpresa?.id != null ? String(syncedEmpresa.id) : "";

      const roles: Role[] = updatedUser.roles ?? [];
      const matchedRole =
        roles.find(
          (role) =>
            role.contexto === "empresa" &&
            Boolean(previousEmpresaId) &&
            role.empresaId === previousEmpresaId,
        ) ??
        roles.find(
          (role) =>
            role.contexto === "empresa" &&
            Boolean(syncedEmpresaId) &&
            role.empresaId === syncedEmpresaId,
        ) ??
        roles.find((role) => role.contexto === "empresa");

      if (matchedRole) {
        setCurrentRole(matchedRole);
      } else {
        setCurrentRole({
          ...currentRole,
          empresaId: syncedEmpresaId || currentRole?.empresaId,
          nivel: 2,
          empresa: syncedEmpresa,
        } as Role);
      }

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

  const formik = useFormik<SiiSyncFormData>({
    initialValues: {
      siiRut: empresaRut,
      siiPassword: "",
    },
    enableReinitialize: true,
    validationSchema: siiSyncSchema,
    onSubmit: handleSyncSii,
  });

  const resetModalState = () => {
    setAlertStatus(null);
    setAlertMessage("");
    setShowPassword(false);
    formik.resetForm();
  };

  const handleDismiss = () => {
    if (loading) return;
    setOpen(false);
    resetModalState();
    // Clear pending role so the user can pick another enrolled entity
    setCurrentRole(null);
    if (location.pathname !== "/role-selection") {
      navigate("/role-selection");
    }
  };

  const handleContinue = () => {
    setOpen(false);
    resetModalState();
    navigate("/dashboard");
  };

  return (
    <Dialog
      open={open}
      onClose={handleDismiss}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "var(--radius-l)", maxWidth: 420, p: 1 },
      }}
    >
      <DialogTitle sx={{ position: "relative", textAlign: "center", pt: 3, pb: 1 }}>
        <IconButton
          onClick={handleDismiss}
          disabled={loading}
          aria-label="Cerrar"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            component="img"
            src={siiLogo}
            alt="Logo SII"
            sx={{ width: 80, height: "auto" }}
          />
          <Typography variant="h5" fontWeight={600}>
            Sincroniza tu empresa
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert severity={alertStatus} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        {alertStatus !== "success" && (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Para comenzar a operar, sincroniza los datos de tu empresa con el
              SII. Ingresa la contraseña asociada al RUT de la empresa.
            </Typography>

            <StyledTextField
              fullWidth
              label="RUT del SII"
              name="siiRut"
              value={formik.values.siiRut}
              InputProps={{ readOnly: true }}
              sx={readOnlyFieldSx}
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
              helperText={
                formik.touched.siiPassword && formik.errors.siiPassword
              }
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleDismiss}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  px: 3,
                  borderRadius: "var(--radius-m)",
                }}
              >
                Elegir otra entidad
              </Button>
              <Button
                variant="contained"
                onClick={() => formik.handleSubmit()}
                disabled={loading || !formik.isValid || !formik.dirty}
                sx={{
                  backgroundColor: "primary.main",
                  textTransform: "none",
                  px: 4,
                  borderRadius: "var(--radius-m)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
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
          </>
        )}

        {alertStatus === "success" && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                backgroundColor: "success.main",
                textTransform: "none",
                px: 4,
                borderRadius: "var(--radius-m)",
                color: "white",
                "&:hover": {
                  backgroundColor: "success.dark",
                },
              }}
            >
              Continuar
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SiiSyncPromptModal;
