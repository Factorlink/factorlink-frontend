import { Box, Typography } from "@mui/material";
import Banner from "./components/Banner";

const DocumentosLegales = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Documentos Legales
      </Typography>
      <Banner />
    </Box>
  );
};

export default DocumentosLegales;