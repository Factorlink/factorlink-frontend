import { Box } from "@mui/material";
import Profile from "../../../components/Edit/Profile";
import AccountStatus from "../../../components/Edit/AccountStatus";
import ChangePassword from "../../../components/Edit/ChangePassword";
import useAuthStore from "../../../store/authStore";

const UsuarioTab = () => {
  const { user } = useAuthStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
      <AccountStatus isActive={user?.isActive} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: { xs: 2, md: 3 },
          alignItems: "start",
        }}
      >
        <Profile />
        <ChangePassword />
      </Box>
    </Box>
  );
};

export default UsuarioTab;
