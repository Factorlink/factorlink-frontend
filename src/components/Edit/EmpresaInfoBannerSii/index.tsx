import { Box, Button, Typography } from "@mui/material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

interface EmpresaInfoBannerSiiProps {
  onUpdateCredentials?: () => void;
}

const EmpresaInfoBannerSii = ({ onUpdateCredentials }: EmpresaInfoBannerSiiProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            backgroundColor: "#00BCD4",
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ApartmentOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
        </Box>
        <Box>
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
          borderRadius: 2,
          fontWeight: 500,
          backgroundColor: "#00BCD4",
          color: "common.white",
          px: 3,
          py: 1.2,
          boxShadow: "none",
          whiteSpace: "nowrap",
          "&:hover": {
            backgroundColor: "#0097A7",
            boxShadow: "none",
          },
        }}
      >
        Actualizar credenciales
      </Button>
    </Box>
  );
};

export default EmpresaInfoBannerSii;
