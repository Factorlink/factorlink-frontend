import {
  Box,
} from "@mui/material";

import Profile from "./Profile";

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

      <Profile />
    </Box>
  );
};

export default Header;
