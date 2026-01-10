import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Layout from "../../components/Layout";
import Profile from "../../components/Edit/Profile";
import Empresa from "../../components/Edit/Empresa";
import Factoring from "../../components/Edit/Factoring";
import useAuthStore from "../../store/authStore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const Edit = () => {
  const [tabValue, setTabValue] = useState(0);

  const { currentRole } = useAuthStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Layout>
      <Box sx={{ p: 3, flex: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Usuario" />
            <Tab
              label="Empresa"
              disabled={currentRole?.contexto !== "empresa"}
            />
            <Tab
              label="Factoring"
              disabled={currentRole?.contexto !== "factoring"}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Profile />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Empresa />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Factoring />
        </TabPanel>
      </Box>
    </Layout>
  );
};

export default Edit;
