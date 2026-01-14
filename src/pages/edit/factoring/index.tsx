import { Box } from "@mui/material";
import Factoring from "../../../components/Edit/Factoring";
import FactoringState from "../../../components/Edit/FactoringState";
import useAuthStore from "../../../store/authStore";

const FactoringTab = () => {
  const { currentRole } = useAuthStore();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <FactoringState estadoEnrolamiento={currentRole?.factoring?.estadoEnrolamiento} />
      <Factoring />;
    </Box>
  );
};

export default FactoringTab;
