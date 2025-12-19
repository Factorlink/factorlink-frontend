import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, Notifications } from "@mui/icons-material";

const Header = () => {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "background.paper",
      }}
    >
      {/* Left - Suite Empresa */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "common.white",
          px: 3,
          py: 1,
          borderRadius: 2,
          fontWeight: 500,
        }}
      >
        Suite Empresa
      </Box>

      {/* Right - Status and Profile */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Actualizado hace 2 minutos
        </Typography>

        <IconButton
          sx={{
            backgroundColor: "success.main",
            color: "white",
            "&:hover": {
              backgroundColor: "success.dark",
            },
          }}
        >
          <Notifications />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              backgroundColor: "primary.light",
            }}
          >
            FO
          </Avatar>
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}
            >
              Felipe Ortega
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem" }}
            >
              Factorlink S.A
            </Typography>
          </Box>
          <KeyboardArrowDown sx={{ color: "text.secondary" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
