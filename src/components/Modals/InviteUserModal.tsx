import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StyledTextField } from "../../pages/register/styles";
import { useRole } from "../../hooks/useRole";
import useAuthStore from "../../store/authStore";
import { emailValidation } from "../../utils/validations/shared-fields";
import { ROLES, ROLE_NAMES } from "../../utils/consts";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "invite" | "edit";
  userData?: {
    email: string;
    currentRole?: string;
  };
}

interface InviteFormData {
  email: string;
  role: string;
}

const EMPRESA_ROLES = [ROLES.EMPRESA_USUARIO];
const FACTORING_ROLES = [ROLES.FACTORING_ANALISTA];

const InviteUserModal = ({
  open,
  onClose,
  onSuccess,
  mode = "invite",
  userData,
}: InviteUserModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");

  const { currentRole } = useAuthStore();
  const { assignToEmpresa, assignToFactoring, loading } = useRole();

  const isEmpresa = currentRole?.contexto === "empresa";
  const availableRoles = isEmpresa ? EMPRESA_ROLES : FACTORING_ROLES;
  const isEditMode = mode === "edit";

  const validationSchema = Yup.object({
    email: emailValidation,
    role: Yup.string().required("El rol es requerido"),
  });

  const handleSubmit = async (values: InviteFormData) => {
    try {
      if (isEmpresa) {
        await assignToEmpresa({
          email: values.email.trim(),
          role: values.role as "EMPRESA_ADMIN" | "EMPRESA_USUARIO",
          empresaId: currentRole?.empresaId || "",
        });
      } else {
        await assignToFactoring({
          email: values.email.trim(),
          role: values.role as "FACTORING_ADMIN" | "FACTORING_ANALISTA",
          factoringId: currentRole?.factoringId || "",
        });
      }

      setAlertStatus("success");
      setAlertMessage(
        isEditMode
          ? "Rol actualizado correctamente."
          : "Invitación enviada correctamente.",
      );
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          (isEditMode
            ? "Ocurrió un error al actualizar el rol"
            : "Ocurrió un error al enviar la invitación"),
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
    formik.resetForm();
    onClose();
  };

  const formik = useFormik<InviteFormData>({
    initialValues: {
      email: userData?.email || "",
      role: userData?.currentRole || "",
    },
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (open && userData) {
      formik.setValues({
        email: userData.email || "",
        role: userData.currentRole || "",
      });
    }
  }, [open, userData]);

  const modalTitle = isEditMode ? "Cambiar Rol" : "Invitar Usuario";
  const modalDescription = isEditMode
    ? `Selecciona el nuevo rol para el usuario.`
    : `Ingresa el correo electrónico del usuario que deseas invitar a ${
        isEmpresa ? "la empresa" : "el factoring"
      }.`;
  const submitButtonText = isEditMode ? "Guardar Cambios" : "Enviar Invitación";

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
              backgroundColor: isEditMode ? "#F59E0B" : "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isEditMode ? (
              <EditIcon sx={{ color: "white", fontSize: 24 }} />
            ) : (
              <PersonAddIcon sx={{ color: "white", fontSize: 24 }} />
            )}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {modalTitle}
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
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {modalDescription}
          </Typography>
        )}

        {alertStatus !== "success" && (
          <form onSubmit={formik.handleSubmit}>
            <StyledTextField
              fullWidth
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              name="email"
              type="email"
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading || isEditMode}
              sx={{ mb: 3 }}
            />

            <FormControl
              fullWidth
              error={formik.touched.role && Boolean(formik.errors.role)}
              disabled={loading || isEditMode}
            >
              <InputLabel id="role-select-label">Rol</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                name="role"
                value={formik.values.role}
                label="Rol"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{
                  borderRadius: 1,
                  backgroundColor: "background.default",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {ROLE_NAMES[role]}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.role && formik.errors.role && (
                <FormHelperText>{formik.errors.role}</FormHelperText>
              )}
            </FormControl>
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {alertStatus === "success" ? "Cerrar" : "Cancelar"}
        </Button>
        {alertStatus !== "success" && (
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={
              loading || !formik.isValid || (!isEditMode && !formik.dirty)
            }
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: isEditMode ? "#F59E0B" : "primary.main",
              "&:hover": {
                backgroundColor: isEditMode ? "#D97706" : undefined,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              submitButtonText
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserModal;
