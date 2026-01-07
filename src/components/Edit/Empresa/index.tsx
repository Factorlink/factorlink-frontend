import { useFormik } from "formik";
import { Box, Button, Typography, Container } from "@mui/material";
import { StyledTextField } from "../../../pages/register/styles";
import { empresaFieldsSchema } from "../../../utils/validations/empresa-fields";

interface EmpresaFormData {
  rut: string;
  razonSocial: string;
  giro: string;
  direccion: string;
}

const Empresa = () => {
  const formik = useFormik<EmpresaFormData>({
    initialValues: {
      rut: "",
      razonSocial: "",
      giro: "",
      direccion: "",
    },
    validationSchema: empresaFieldsSchema,
    onSubmit: (values) => {
      console.log("Valores del formulario:", values);
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
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
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
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => formik.resetForm()}
                disabled={!formik.dirty}
                sx={{
                  backgroundColor: "secondary.main",
                  color: "white",
                  textTransform: "none",
                  padding: "12px 24px",
                  borderRadius: 2,
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={() => formik.handleSubmit()}
                disabled={!formik.isValid || !formik.dirty}
                sx={{
                  backgroundColor: "success.main",
                  color: "white",
                  textTransform: "none",
                  padding: "12px 24px",
                  borderRadius: 2,
                }}
              >
                Guardar cambios
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Empresa;
