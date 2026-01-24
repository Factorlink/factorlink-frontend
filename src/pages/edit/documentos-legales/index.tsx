import { Box } from "@mui/material";
import LegalDocuments from "../../../components/Edit/LegalDocuments";

const DocumentosLegalesTab = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <LegalDocuments />
    </Box>
  );
};

export default DocumentosLegalesTab;
