import { useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEmpresa } from "../../../hooks/useEmpresa";
import { StyledTextField } from "../../../pages/register/styles";
import { empresaFieldsSchema } from "../../../utils/validations/empresa-fields";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";

interface EmpresaFormData {
  rut: string;
  razonSocial: string;
  giro: string;
  direccion: string;
}

const Empresa = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const { currentRole } = useAuthStore();

  const { createEmpresa, updateEmpresa, loading } = useEmpresa();

  const handleCreateEmpresa = async (values: EmpresaFormData) => {
    try {
      const response = await createEmpresa({
        rut: values.rut.trim(),
        razonSocial: values.razonSocial.trim(),
        giro: values.giro.trim(),
        direccion: values.direccion.trim(),
      });

      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        empresa: response,
      } as Role);

      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string[] } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message?.[0] ||
          "Ocurrió un error al crear la empresa"
      );
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const handleUpdateEmpresa = async (values: EmpresaFormData) => {
    try {
      const response = await updateEmpresa(currentRole?.empresa?.id || "", {
        rut: values.rut.trim(),
        razonSocial: values.razonSocial.trim(),
        giro: values.giro.trim(),
        direccion: values.direccion.trim(),
      });
      
      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        empresa: response,
      } as Role);

      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string[] } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message?.[0] ||
          "Ocurrió un error al crear la empresa"
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

  const formik = useFormik<EmpresaFormData>({
    initialValues: {
      rut: currentRole?.empresa?.rut || "",
      razonSocial: currentRole?.empresa?.razonSocial || "",
      giro: currentRole?.empresa?.giro || "",
      direccion: currentRole?.empresa?.direccion || "",
    },
    validationSchema: empresaFieldsSchema,
    onSubmit: (values) => {
      if (currentRole?.empresa?.id) {
        handleUpdateEmpresa(values);
      } else {
        handleCreateEmpresa(values);
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            padding: { xs: 3, md: 5 },
            alignItems: "center",
            minHeight: 400,
            width: "100%",
          }}
        >
          <Box sx={{ paddingLeft: { md: 2 } }}>
            <Typography
              variant="h6"
              sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
            >
              Información de la Empresa
            </Typography>

            <StyledTextField
              fullWidth
              label="RUT"
              placeholder="12.345.678-9"
              name="rut"
              value={formik.values.rut}
              error={formik.touched.rut && Boolean(formik.errors.rut)}
              helperText={formik.touched.rut && formik.errors.rut}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <StyledTextField
              fullWidth
              label="Razón Social"
              placeholder="Mi Empresa S.A."
              name="razonSocial"
              value={formik.values.razonSocial}
              error={
                formik.touched.razonSocial && Boolean(formik.errors.razonSocial)
              }
              helperText={
                formik.touched.razonSocial && formik.errors.razonSocial
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <StyledTextField
              fullWidth
              label="Giro"
              placeholder="Servicios de consultoría"
              name="giro"
              value={formik.values.giro}
              error={formik.touched.giro && Boolean(formik.errors.giro)}
              helperText={formik.touched.giro && formik.errors.giro}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />

            <StyledTextField
              fullWidth
              label="Dirección"
              placeholder="Av. Principal 123, Santiago"
              name="direccion"
              value={formik.values.direccion}
              error={
                formik.touched.direccion && Boolean(formik.errors.direccion)
              }
              helperText={formik.touched.direccion && formik.errors.direccion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
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
                  "Guardar cambios"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            minWidth: 300,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: modalStatus === "success" ? "success.main" : "error.main",
          }}
        >
          {modalStatus === "success" ? (
            <CheckCircleOutlineIcon />
          ) : (
            <ErrorOutlineIcon />
          )}
          {modalStatus === "success"
            ? "¡Empresa creada!"
            : "Error al crear empresa"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {modalStatus === "success"
              ? "La empresa ha sido registrada correctamente."
              : errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleContinue}
            variant="contained"
            sx={{
              backgroundColor:
                modalStatus === "success" ? "success.main" : "primary.main",
              textTransform: "none",
              "&:hover": {
                backgroundColor:
                  modalStatus === "success" ? "success.dark" : "primary.dark",
              },
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Empresa;
