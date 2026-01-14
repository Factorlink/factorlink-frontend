import { useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import useAuthStore from "../../store/authStore";

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuthStore();

  const getTabValue = () => {
    if (location.pathname.includes("/edit/empresa")) return 1;
    if (location.pathname.includes("/edit/factoring")) return 1;
    return 0;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate("/edit/usuario");
    } else if (newValue === 1) {
      if (currentRole?.contexto === "empresa") {
        navigate("/edit/empresa");
      } else if (currentRole?.contexto === "factoring") {
        navigate("/edit/factoring");
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/edit") {
      navigate("/edit/usuario", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Layout>
      <Box sx={{ p: 3, flex: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={getTabValue()} onChange={handleTabChange}>
            <Tab label="Usuario" />
            {currentRole?.contexto === "empresa" && (
              <Tab label="Empresa" />
            )}
            {currentRole?.contexto === "factoring" && (
              <Tab label="Factoring" />
            )}
          </Tabs>
        </Box>

        <Box sx={{ pt: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Layout>
  );
};

export default Edit;
