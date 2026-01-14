import RegisterForm from "../../../components/Register";
import { ROLES } from "../../../utils/consts";
import { StyledTextField } from "../styles";

const FactoringRegister = () => {
  return (
    <RegisterForm
      roleType={ROLES.FACTORING_ADMIN}
      tabLabel="Factoring"
      renderAdditionalFields={(formik, loading, handleRutChange) => (
        <>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="RUT de Factoring"
            placeholder="12.345.678-9"
            id="factoringRut"
            name="factoringRut"
            disabled={loading}
            value={formik.values.factoringRut || ""}
            error={
              formik.touched.factoringRut &&
              Boolean(formik.errors.factoringRut)
            }
            helperText={
              formik.touched.factoringRut && formik.errors.factoringRut
            }
            onChange={handleRutChange}
            onBlur={formik.handleBlur}
          />
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Razón Social"
            placeholder="Nombre de la empresa"
            id="factoringRazonSocial"
            name="factoringRazonSocial"
            disabled={loading}
            inputProps={{ maxLength: 100 }}
            value={formik.values.factoringRazonSocial || ""}
            error={
              formik.touched.factoringRazonSocial &&
              Boolean(formik.errors.factoringRazonSocial)
            }
            helperText={
              formik.touched.factoringRazonSocial &&
              formik.errors.factoringRazonSocial
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </>
      )}
    />
  );
};

export default FactoringRegister;
