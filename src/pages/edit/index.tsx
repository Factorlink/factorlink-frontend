import { useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import useAuthStore from "../../store/authStore";
import { ROLES } from "../../utils/consts";

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuthStore();

  const buildTabs = () => {
    const empresaRoles = [ROLES.EMPRESA_ADMIN, ROLES.EMPRESA_USUARIO];
    const factoringRoles = [ROLES.FACTORING_ADMIN, ROLES.FACTORING_ANALISTA];
    const adminRoles = [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN];

    const tabs: Array<{ label: string; path: string }> = [
      { label: "Usuario", path: "/edit/usuario" },
    ];

    if (empresaRoles.includes(currentRole?.role || "")) {
      tabs.push({ label: "Empresa", path: "/edit/empresa" });
    }

    if (factoringRoles.includes(currentRole?.role || "")) {
      tabs.push({ label: "Factoring", path: "/edit/factoring" });
    }

    if (adminRoles.includes(currentRole?.role || "")) {
      tabs.push({ label: "Gestión Usuarios", path: "/edit/usuarios" });
    }

    return tabs;
  };

  const getTabValue = () => {
    const tabs = buildTabs();
    const index = tabs.findIndex((t) =>
      location.pathname === t.path,
    );
    return index >= 0 ? index : 0;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const tabs = buildTabs();
    const target = tabs[newValue];
    if (target) navigate(target.path);
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
            {[ROLES.EMPRESA_ADMIN, ROLES.EMPRESA_USUARIO].includes(
              currentRole?.role || "",
            ) && <Tab label="Empresa" />}
            {[ROLES.FACTORING_ADMIN, ROLES.FACTORING_ANALISTA].includes(
              currentRole?.role || "",
            ) && <Tab label="Factoring" />}

            {[ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN].includes(
              currentRole?.role || "",
            ) && <Tab label="Gestión Usuarios" />}
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
