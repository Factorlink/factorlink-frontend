import { Box, Button } from "@mui/material";
import Layout from "../../../components/Layout";
import useAuthStore from "../../../store/authStore";

const RoleSelection = () => {
  const { user, setCurrentRole } = useAuthStore();
  return (
    <Layout hideMenu={true} hideSuite={true}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {user?.roles.map((role) => (
          <li key={role.empresaId}>
            <Button onClick={() => setCurrentRole(role)}>{role.role}</Button>
          </li>
        ))}
      </Box>
    </Layout>
  );
};

export default RoleSelection;
