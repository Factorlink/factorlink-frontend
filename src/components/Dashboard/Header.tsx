import {
  Box,
} from "@mui/material";

import Profile from "./Profile";
import useAuthStore from "../../store/authStore";
import { capitalizeString } from "../../utils/utils";

const Header = ({ hideSuite = false }: { hideSuite?: boolean }) => {

  const { currentRole } = useAuthStore();

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
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "common.white",
          px: 3,
          py: 1,
          borderRadius: 2,
          fontWeight: 500,
          visibility: !hideSuite ? "visible" : "hidden",
        }}
      >
        Suite { capitalizeString(currentRole?.contexto || "") }
      </Box> 

      <Profile />
    </Box>
  );
};

export default Header;
