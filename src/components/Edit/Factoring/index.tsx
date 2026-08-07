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
import { useFactoring } from "../../../hooks/useFactoring";
import { StyledTextField } from "../../../pages/register/styles";
import { factoringFieldsSchema } from "../../../utils/validations/factoring-fields";
import { handleRutInputChange } from "../../../utils/validations/shared-fields";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";
import { ROLES } from "../../../utils/consts";
import { surface } from "../../../theme";

interface FactoringFormData {
  rut: string;
  razonSocial: string;
  direccion: string;
}

const Factoring = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { currentRole } = useAuthStore();

  const { createFactoring, updateFactoring, loading } = useFactoring();
  const isReadOnly = currentRole?.role !== ROLES.FACTORING_ADMIN;

  const handleCreateFactoring = async (values: FactoringFormData) => {
    setIsEditing(false);
    try {
      const response = await createFactoring({
        rut: values.rut.trim(),
        razonSocial: values.razonSocial.trim(),
        direccion: values.direccion.trim(),
      });

      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        factoring: response,
      } as Role);

      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string[] } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message?.[0] ||
          "Ocurrió un error al crear el factoring",
      );
      setModalStatus("error");
      setModalOpen(true);
    }
  };

  const handleUpdateFactoring = async (values: FactoringFormData) => {
    setIsEditing(true);
    try {
      const response = await updateFactoring(currentRole?.factoring?.id || "", {
        rut: values.rut.trim(),
        razonSocial: values.razonSocial.trim(),
        direccion: values.direccion.trim(),
      });

      useAuthStore.getState().setCurrentRole({
        ...currentRole,
        factoring: response,
      } as Role);

      setModalStatus("success");
      setModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al actualizar el factoring",
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

  const formik = useFormik<FactoringFormData>({
    initialValues: {
      rut: currentRole?.factoring?.rut || "",
      razonSocial: currentRole?.factoring?.razonSocial || "",
      direccion: currentRole?.factoring?.direccion || "",
    },
    validationSchema: factoringFieldsSchema,
    onSubmit: (values) => {
      if (currentRole?.factoring?.id) {
        handleUpdateFactoring(values);
      } else {
        handleCreateFactoring(values);
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
            <Typography
              variant="h6"
              sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
            >
              Información del Factoring
            </Typography>

            <StyledTextField
              fullWidth
              label="RUT"
              placeholder="12.345.678-9"
              name="rut"
              value={formik.values.rut}
              error={formik.touched.rut && Boolean(formik.errors.rut)}
              helperText={formik.touched.rut && formik.errors.rut}
              onChange={handleRutChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly: isReadOnly }}
              sx={
                isReadOnly
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
              placeholder="Factoring Chile S.A."
              name="razonSocial"
              inputProps={{ maxLength: 100 }}
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
              InputProps={{ readOnly: isReadOnly }}
              sx={
                isReadOnly
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
              inputProps={{ maxLength: 200 }}
              value={formik.values.direccion}
              error={
                formik.touched.direccion && Boolean(formik.errors.direccion)
              }
              helperText={formik.touched.direccion && formik.errors.direccion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              InputProps={{ readOnly: isReadOnly }}
              sx={
                isReadOnly
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

            {!isReadOnly && (
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => formik.resetForm()}
                  disabled={loading || !formik.dirty || isReadOnly}
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
                  disabled={
                    loading || !formik.isValid || !formik.dirty || isReadOnly
                  }
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
        aria-labelledby="factoring-modal-title"
        aria-describedby="factoring-modal-description"
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="factoring-modal-title"
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
                  ? "¡Factoring actualizado!"
                  : "¡Factoring creado!"
                : isEditing
                  ? "Error al actualizar"
                  : "Error al crear"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 3, pt: 0, pb: 0 }}>
          <Typography
            id="factoring-modal-description"
            variant="body1"
            color="text.secondary"
          >
            {modalStatus === "success"
              ? isEditing
                ? "La información del factoring ha sido actualizada correctamente."
                : "El factoring ha sido registrado correctamente."
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

export default Factoring;
