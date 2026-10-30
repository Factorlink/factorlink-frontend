import { useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import useAuthStore from "../../store/authStore";
import { ROLES } from "../../utils/consts";
import { appContentSx } from "../../theme/layoutStyles";

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuthStore();

  const role = currentRole?.role || "";
  const empresaRoles = [ROLES.EMPRESA_ADMIN, ROLES.EMPRESA_USUARIO];
  const factoringRoles = [ROLES.FACTORING_ADMIN, ROLES.FACTORING_ANALISTA];
  const adminRoles = [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN];

  const tabs: Array<{ label: string; path: string }> = [
    { label: "Usuario", path: "/edit/usuario" },
  ];

  if (empresaRoles.includes(role)) {
    tabs.push({ label: "Empresa", path: "/edit/empresa" });
  }

  if (factoringRoles.includes(role)) {
    tabs.push({ label: "Factoring", path: "/edit/factoring" });
  }

  if (role === ROLES.FACTORING_ADMIN && currentRole?.isMaster) {
    tabs.push({ label: "Gestión Usuarios", path: "/edit/usuarios" });
  }

  if (adminRoles.includes(role) && currentRole?.isMaster) {
    tabs.push({ label: "Documentos Legales", path: "/edit/documentos-legales" });
  }

  const getTabValue = () => {
    const index = tabs.findIndex((t) => location.pathname === t.path);
    return index >= 0 ? index : 0;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const target = tabs[newValue];
    if (target) navigate(target.path);
  };

  useEffect(() => {
    if (location.pathname === "/edit") {
      navigate("/edit/usuario", { replace: true });
      return;
    }
    const allowed = tabs.some((t) => location.pathname === t.path);
    if (!allowed) {
      navigate("/edit/usuario", { replace: true });
    }
  }, [location.pathname, navigate, role, currentRole?.isMaster]);

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={getTabValue()}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {tabs.map((t) => (
              <Tab key={t.path} label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ pt: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Layout>
  );
};

export default Edit;
