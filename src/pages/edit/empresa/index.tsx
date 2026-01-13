import { Box } from "@mui/material";
import AccountLevels from "../../../components/Edit/AccountLevels";
import Empresa from "../../../components/Edit/Empresa";
import useAuthStore from "../../../store/authStore";

const EmpresaTab = () => {
  const { currentRole } = useAuthStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AccountLevels currentLevel={currentRole?.nivel as 1 | 2 | 3 | undefined} />
      <Empresa />
    </Box>
  );
};

export default EmpresaTab;
