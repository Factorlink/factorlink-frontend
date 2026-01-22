import { Box } from "@mui/material";
import useAuthStore from "../../../store/authStore";
import EmpresaDocumentStatus from "./EmpresaDocumentStatus";
import FactoringDocumentStatus from "./FactoringDocumentStatus";
import ValidationProcessInfo from "./ValidationProcessInfo";

const LegalDocuments = () => {
  const { currentRole } = useAuthStore();

  const isEmpresa = currentRole?.contexto === "empresa";
  const isFactoring = currentRole?.contexto === "factoring";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {isEmpresa && <EmpresaDocumentStatus currentLevel={currentRole.nivel} />}
      {isFactoring && (
        <FactoringDocumentStatus
          estadoEnrolamiento={currentRole.factoring?.estadoEnrolamiento}
        />
      )}
      <ValidationProcessInfo />
    </Box>
  );
};

export default LegalDocuments;
