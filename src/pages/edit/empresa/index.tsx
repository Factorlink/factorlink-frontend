import { useState } from "react";
import { Box } from "@mui/material";
import SiiSync from "../../../components/Edit/SiiSync";
import SiiPersonalSync from "../../../components/Edit/SiiPersonalSync";
import Empresa from "../../../components/Edit/Empresa";
import SiiSyncModal from "../../../components/Modals/SiiSyncModal";
import SiiPersonalSyncModal from "../../../components/Modals/SiiPersonalSyncModal";
import useAuthStore from "../../../store/authStore";

const EmpresaTab = () => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const isPersonalLinked = empresa?.siiRutPersonal != null;

  const [siiSyncModalOpen, setSiiSyncModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncModalIsUpdate, setSyncModalIsUpdate] = useState(false);

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
      {currentRole?.nivel && currentRole?.nivel === 1 && <SiiSync />}
      {currentRole?.nivel && currentRole?.nivel !== 1 && (
        <Empresa
          onUpdateCredentials={() => setSiiSyncModalOpen(true)}
          readOnly={true}
        />
      )}
      {currentRole?.nivel && currentRole?.nivel !== 1 && (
        <Box id="sii-personal-sync-card">
          <SiiPersonalSync
            isLinked={isPersonalLinked}
            onLink={handleLink}
            onUpdate={handleUpdate}
          />
        </Box>
      )}

      <SiiSyncModal
        open={siiSyncModalOpen}
        onClose={() => setSiiSyncModalOpen(false)}
      />
      <SiiPersonalSyncModal
        open={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        isUpdate={syncModalIsUpdate}
      />
    </Box>
  );
};

export default EmpresaTab;
