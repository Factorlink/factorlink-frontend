import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";
import Layout from "../../../components/Layout";
import RoleCard from "./components/role-card";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user, currentRole, setCurrentRole } = useAuthStore();

  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    navigate("/dashboard");
  };

  const rolesList: Role[] = user?.roles || [];

  return (
    <Layout hideSuite hideMenu hideNotifications>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          backgroundColor: "var(--color-bg-neutral-primary)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 8,
            px: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "var(--color-fg-on-neutral-primary)",
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              mb: 1,
              textAlign: "center",
            }}
          >
            Selecciona una Entidad
          </Typography>
          <Typography
            sx={{
              color: "var(--color-fg-on-neutral-primary)",
              opacity: 0.7,
              mb: 6,
              textAlign: "center",
            }}
          >
            Elige el rol con el que deseas iniciar sesión
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
              maxWidth: 1200,
            }}
          >
            {rolesList.map((role) => (
              <RoleCard
                key={
                  role.contexto === "empresa"
                    ? role.empresaId
                    : role.factoringId
                }
                roleId={
                  role.contexto === "empresa"
                    ? role.empresaId
                    : role.factoringId
                }
                currentRoleId={
                  currentRole?.contexto === "empresa"
                    ? currentRole?.empresaId
                    : currentRole?.factoringId
                }
                handleSelectRole={() => handleSelectRole(role)}
                razonSocial={
                  role.contexto === "empresa"
                    ? role.empresa?.razonSocial
                    : role.factoring?.razonSocial
                }
                roleName={role.role}
                email={
                  role.contexto === "empresa"
                    ? role.empresa?.email
                    : role.factoring?.email
                }
                rut={
                  role.contexto === "empresa"
                    ? role.empresa?.rut
                    : role.factoring?.rut
                }
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default RoleSelection;
