import { useState } from "react";
import { Box } from "@mui/material";
import SiiSync from "../../../components/Edit/SiiSync";
import SiiPersonalSync from "../../../components/Edit/SiiPersonalSync";
import Empresa from "../../../components/Edit/Empresa";
import EmpresaSocios from "../../../components/Edit/EmpresaSocios";
import SiiSyncModal from "../../../components/Modals/SiiSyncModal";
import SiiPersonalSyncModal from "../../../components/Modals/SiiPersonalSyncModal";
import useAuthStore from "../../../store/authStore";
import { isSiiPersonalLinked } from "../../../types/empresa";

const EmpresaTab = () => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const isPersonalLinked = isSiiPersonalLinked(empresa);
  const isEmpresaActiva = empresa?.estadoEnrolamiento === "ACTIVO";

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
      {!isEmpresaActiva && <SiiSync />}
      {isEmpresaActiva && (
        <Empresa
          onUpdateCredentials={() => setSiiSyncModalOpen(true)}
          readOnly={true}
        />
      )}
      {isEmpresaActiva && <EmpresaSocios />}
      {isEmpresaActiva && (
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
