import { Box, Typography } from "@mui/material";
import  useAuthStore  from "../../../../../store/authStore";



const Banner = () => {
    const { currentRole } = useAuthStore();
  return (
    <Box sx={{ p: 3, flex: 1 }}>
      {currentRole?.contexto === "empresa" && (
        <Typography variant="h4" sx={{ mb: 2 }}>
          Documentos Legales Empresa
        </Typography>
      )}
      {currentRole?.contexto === "factoring" && (
        <Typography variant="h4" sx={{ mb: 2 }}>
          Documentos Legales Factoring
        </Typography>
      )}
    </Box>
  );
};

export default Banner;