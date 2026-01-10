import { Box, Typography, Container } from "@mui/material";
import Banner from "./components/Banner";

const DocumentosLegales = () => {
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
            minHeight: 300,
            width: "100%",
          }}
        >
          <Box sx={{ paddingLeft: { md: 2 } }}>
            <Typography
              variant="h6"
              sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
            >
              Documentos Legales
            </Typography>
            <Banner />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DocumentosLegales;
