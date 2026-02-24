import { Box, Typography } from "@mui/material";
import { StyledTextField } from "../../../pages/register/styles";
import useAuthStore from "../../../store/authStore";

const SiiPersonalInfo = () => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;

  return (
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
          width: "100%",
        }}
      >
        <Box sx={{ paddingLeft: { md: 2 } }}>
          <Typography
            variant="h6"
            sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
          >
            Información Personal SII
          </Typography>

          {[
            { label: "RUT Personal", value: empresa?.siiRutPersonal || "" },
            { label: "Razón Social", value: empresa?.siiRazonSocialPersonal || "" },
            { label: "Email", value: empresa?.siiEmailPersonal || "" },
            { label: "Dirección", value: empresa?.siiDireccionPersonal || "" },
          ].map((field) => (
            <StyledTextField
              key={field.label}
              fullWidth
              label={field.label}
              value={field.value}
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input": {
                  color: "text.secondary",
                  cursor: "default",
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SiiPersonalInfo;
