import { Box } from "@mui/material";
import AccountLevels from "../../../components/Edit/AccountLevels";
import SiiSync from "../../../components/Edit/SiiSync";
import SiiPersonalSync from "../../../components/Edit/SiiPersonalSync";
import Empresa from "../../../components/Edit/Empresa";
import useAuthStore from "../../../store/authStore";

const EmpresaTab = () => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const isPersonalLinked = empresa?.siiRutPersonal != null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AccountLevels currentLevel={currentRole?.nivel as 1 | 2 | 3 | undefined} />
      {currentRole?.nivel && currentRole?.nivel === 1 && <SiiSync />}
      {currentRole?.nivel && currentRole?.nivel !== 1 && <Empresa readOnly={true} />}
      {currentRole?.nivel && currentRole?.nivel !== 1 && (
        <SiiPersonalSync
          isLinked={isPersonalLinked}
        />
      )}
    </Box>
  );
};

export default EmpresaTab;
