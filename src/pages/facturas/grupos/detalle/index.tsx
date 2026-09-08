import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Layout from "../../../../components/Layout";
import { appContentSx, pageHeaderSx } from "../../../../theme/layoutStyles";

const FacturaGrupoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box sx={pageHeaderSx}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Grupo de cotización
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              Stub temporal. Id del grupo: {id || "—"}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/facturas")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Volver a facturas
        </Button>
      </Box>
    </Layout>
  );
};

export default FacturaGrupoDetalle;
