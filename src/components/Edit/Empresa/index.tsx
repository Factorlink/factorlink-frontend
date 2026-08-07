import { useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Typography,
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
import { handleRutInputChange } from "../../../utils/validations/shared-fields";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { surface } from "../../../theme";
import { pageHeaderSx } from "../../../theme/layoutStyles";

interface EmpresaFormData {
  rut: string;
  razonSocial: string;
  giro: string;
  email: string;
  direccion: string;
  
}

interface EmpresaProps {
  readOnly?: boolean;
  onUpdateCredentials: () => void;
}

const Empresa = ({onUpdateCredentials, readOnly = false }: EmpresaProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { currentRole } = useAuthStore();

  const { createEmpresa, updateEmpresa, loading } = useEmpresa();

  const handleCreateEmpresa = async (values: EmpresaFormData) => {
    setIsEditing(false);
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
          "Ocurrió un error al crear la empresa",
      );
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const handleUpdateEmpresa = async (values: EmpresaFormData) => {
    setIsEditing(true);
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
          "Ocurrió un error al actualizar la empresa",
      );
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const handleCloseModal = (
    _event?: unknown,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setModalOpen(false);
  };

  const handleContinue = () => {
    setModalOpen(false);
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRutInputChange(e, formik.setFieldValue);
  };

  const formik = useFormik<EmpresaFormData>({
    initialValues: {
      rut: currentRole?.empresa?.rut || "",
      razonSocial: currentRole?.empresa?.razonSocial || "",
      giro: currentRole?.empresa?.giro || "",
      email: currentRole?.empresa?.email || "",
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
    enableReinitialize: true,
  });

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
            minHeight: 400,
            width: "100%",
          }}
        >
          <Box sx={{ paddingLeft: { md: 2 } }}>
            <Box
              sx={[
                pageHeaderSx,
                {
                  mb: 0,
                  paddingBottom: 3,
                },
              ]}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                <Box
                  sx={{
                    backgroundColor: "var(--color-bg-accent-primary)",
                    borderRadius: "var(--radius-m)",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ApartmentOutlinedIcon
                    sx={{ color: "white", fontSize: 28 }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "text.primary", fontWeight: 600 }}
                  >
                    Información de la Empresa
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Datos tributarios sincronizados desde el SII
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<VpnKeyOutlinedIcon />}
                onClick={onUpdateCredentials}
                sx={{
                  textTransform: "none",
                  borderRadius: "var(--radius-m)",
                  fontWeight: 500,
                  backgroundColor: "var(--color-bg-accent-primary)",
                  color: "common.white",
                  px: 3,
                  py: 1.2,
                  boxShadow: "none",
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor: "var(--color-bg-accent-primary-hover)",
                    boxShadow: "none",
                  },
                }}
              >
                Actualizar credenciales
              </Button>
            </Box>

            <StyledTextField
              fullWidth
              label="RUT"
              placeholder="12.345.678-9"
              name="rut"
              value={formik.values.rut}
              error={
                !readOnly && formik.touched.rut && Boolean(formik.errors.rut)
              }
              helperText={!readOnly && formik.touched.rut && formik.errors.rut}
              onChange={handleRutChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly }}
              sx={
                readOnly
                  ? {
                      "& .MuiInputBase-input": {
                        color: "text.secondary",
                        cursor: "default",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "action.hover",
                      },
                    }
                  : undefined
              }
            />

            <StyledTextField
              fullWidth
              label="Razón Social"
              placeholder="Mi Empresa S.A."
              name="razonSocial"
              value={formik.values.razonSocial}
              error={
                !readOnly &&
                formik.touched.razonSocial &&
                Boolean(formik.errors.razonSocial)
              }
              helperText={
                !readOnly &&
                formik.touched.razonSocial &&
                formik.errors.razonSocial
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly }}
              sx={
                readOnly
                  ? {
                      "& .MuiInputBase-input": {
                        color: "text.secondary",
                        cursor: "default",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "action.hover",
                      },
                    }
                  : undefined
              }
            />

            <StyledTextField
              fullWidth
              label="Giro Principal"
              placeholder="Servicios de consultoría"
              name="giro"
              value={formik.values.giro}
              error={
                !readOnly && formik.touched.giro && Boolean(formik.errors.giro)
              }
              helperText={
                !readOnly && formik.touched.giro && formik.errors.giro
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly }}
              sx={
                readOnly
                  ? {
                      "& .MuiInputBase-input": {
                        color: "text.secondary",
                        cursor: "default",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "action.hover",
                      },
                    }
                  : undefined
              }
            />

            <StyledTextField
              fullWidth
              label="Email"
              placeholder="contacto@empresa.cl"
              name="email"
              value={formik.values.email}
              error={
                !readOnly &&
                formik.touched.email &&
                Boolean(formik.errors.email)
              }
              helperText={
                !readOnly && formik.touched.email && formik.errors.email
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly }}
              sx={
                readOnly
                  ? {
                      "& .MuiInputBase-input": {
                        color: "text.secondary",
                        cursor: "default",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "action.hover",
                      },
                    }
                  : undefined
              }
            />

            <StyledTextField
              fullWidth
              label="Dirección"
              placeholder="Av. Principal 123, Santiago"
              name="direccion"
              value={formik.values.direccion}
              error={
                !readOnly &&
                formik.touched.direccion &&
                Boolean(formik.errors.direccion)
              }
              helperText={
                !readOnly && formik.touched.direccion && formik.errors.direccion
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly }}
              sx={
                readOnly
                  ? {
                      "& .MuiInputBase-input": {
                        color: "text.secondary",
                        cursor: "default",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "action.hover",
                      },
                    }
                  : undefined
              }
            />

            {!readOnly && (
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => formik.resetForm()}
                  disabled={loading || !formik.dirty}
                  sx={{
                    textTransform: "none",
                    padding: "12px 24px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: "var(--radius-m)",
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
                    "Guardar cambios"
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        disableEscapeKeyDown
        aria-labelledby="empresa-modal-title"
        aria-describedby="empresa-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="empresa-modal-title"
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
                ? isEditing
                  ? "¡Empresa actualizada!"
                  : "¡Empresa creada!"
                : isEditing
                  ? "Error al actualizar"
                  : "Error al crear"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography
            id="empresa-modal-description"
            variant="body1"
            color="text.secondary"
          >
            {modalStatus === "success"
              ? isEditing
                ? "La información de la empresa ha sido actualizada correctamente."
                : "La empresa ha sido registrada correctamente."
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
                borderRadius: "var(--radius-m)",
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
                borderRadius: "var(--radius-m)",
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
    </>
  );
};

export default Empresa;
