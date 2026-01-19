import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StyledTextField } from "../../pages/register/styles";
import { useRole } from "../../hooks/useRole";
import useAuthStore from "../../store/authStore";
import { emailValidation } from "../../utils/validations/shared-fields";
import { ROLES } from "../../utils/consts";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface InviteFormData {
  email: string;
}

const validationSchema = Yup.object({
  email: emailValidation,
});

const InviteUserModal = ({ open, onClose, onSuccess }: InviteUserModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const { currentRole } = useAuthStore();
  const { assignToEmpresa, assignToFactoring, loading } = useRole();

  const isEmpresa = currentRole?.contexto === "empresa";

  const handleInvite = async (values: InviteFormData) => {
    try {
      if (isEmpresa) {
        await assignToEmpresa({
          email: values.email.trim(),
          role: ROLES.EMPRESA_USUARIO as "EMPRESA_ADMIN" | "EMPRESA_USUARIO",
          empresaId: currentRole?.empresaId || "",
        });
      } else {
        await assignToFactoring({
          email: values.email.trim(),
          role: ROLES.FACTORING_ANALISTA as "FACTORING_ADMIN" | "FACTORING_ANALISTA",
          factoringId: currentRole?.factoringId || "",
        });
      }

      setAlertStatus("success");
      setAlertMessage("Invitación enviada correctamente.");
      formik.resetForm();
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al enviar la invitación"
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
      email: "",
    },
    validationSchema,
    onSubmit: handleInvite,
  });

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
            <PersonAddIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Invitar Usuario
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

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Ingresa el correo electrónico del usuario que deseas invitar a{" "}
          {isEmpresa ? "la empresa" : "el factoring"}. Se le asignará el rol de{" "}
          <strong>{isEmpresa ? "Usuario Empresa" : "Analista Factoring"}</strong>.
        </Typography>

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
            disabled={loading || alertStatus === "success"}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 2 }}>
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
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => formik.handleSubmit()}
          disabled={loading || alertStatus === "success" || !formik.isValid || !formik.dirty}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "white",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Enviar Invitación"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteUserModal;
