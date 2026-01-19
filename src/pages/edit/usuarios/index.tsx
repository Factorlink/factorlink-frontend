import { Box } from "@mui/material";
import Users from "../../../components/Edit/Users";

const UsuariosTab = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Users />
    </Box>
  );
};

export default UsuariosTab;
