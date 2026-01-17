import { Box } from "@mui/material";
import Users from "../../../components/Edit/Users";
import useAuthStore from "../../../store/authStore";

const UsuariosTab = () => {
  const { currentRole } = useAuthStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Users />
    </Box>
  );
};

export default UsuariosTab;
