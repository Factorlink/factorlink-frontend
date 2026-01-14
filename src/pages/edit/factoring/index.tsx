import { Box } from "@mui/material";
import Factoring from "../../../components/Edit/Factoring";

const FactoringTab = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Factoring />;
    </Box>
  );
};

export default FactoringTab;
