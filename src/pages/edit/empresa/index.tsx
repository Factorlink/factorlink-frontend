import { useState } from "react";
import { Box } from "@mui/material";
import AccountLevels from "../../../components/Edit/AccountLevels";
import EmpresaInfoBannerSii from "../../../components/Edit/EmpresaInfoBannerSii";
import SiiSync from "../../../components/Edit/SiiSync";
import SiiPersonalSync from "../../../components/Edit/SiiPersonalSync";
import SiiPersonalInfo from "../../../components/Edit/SiiPersonalInfo";
import Empresa from "../../../components/Edit/Empresa";
import SiiPersonalSyncModal from "../../../components/Modals/SiiPersonalSyncModal";
import UnlinkSiiPersonalModal from "../../../components/Modals/UnlinkSiiPersonalModal";
import useAuthStore from "../../../store/authStore";

const EmpresaTab = () => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const isPersonalLinked = empresa?.siiRutPersonal != null;

  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncModalIsUpdate, setSyncModalIsUpdate] = useState(false);
  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);

  const handleLink = () => {
    setSyncModalIsUpdate(false);
    setSyncModalOpen(true);
  };

  const handleUpdate = () => {
    setSyncModalIsUpdate(true);
    setSyncModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AccountLevels currentLevel={currentRole?.nivel as 1 | 2 | 3 | undefined} />
      {currentRole?.nivel && currentRole?.nivel !== 1 && <EmpresaInfoBannerSii />}
      {currentRole?.nivel && currentRole?.nivel === 1 && <SiiSync />}
      {currentRole?.nivel && currentRole?.nivel !== 1 && <Empresa readOnly={true} />}
      {currentRole?.nivel && currentRole?.nivel !== 1 && (
        <SiiPersonalSync
          isLinked={isPersonalLinked}
          onLink={handleLink}
          onUpdate={handleUpdate}
          onUnlink={() => setUnlinkModalOpen(true)}
        />
      )}
      {isPersonalLinked && <SiiPersonalInfo />}

      <SiiPersonalSyncModal
        open={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        isUpdate={syncModalIsUpdate}
      />
      <UnlinkSiiPersonalModal
        open={unlinkModalOpen}
        onClose={() => setUnlinkModalOpen(false)}
      />
    </Box>
  );
};

export default EmpresaTab;
