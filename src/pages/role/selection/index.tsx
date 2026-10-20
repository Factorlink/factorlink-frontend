import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";
import Layout from "../../../components/Layout";
import RoleCard from "./components/role-card";
import DemoCard from "./components/demo-card";
import DemoVideoModal from "../../../components/Modals/DemoVideoModal";

const isPendingEmpresaEnrollment = (role: Role) =>
  role.contexto === "empresa" &&
  (!role.empresaId || role.empresa?.estadoEnrolamiento === "PENDIENTE");

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user, currentRole, setCurrentRole } = useAuthStore();
  const [demoOpen, setDemoOpen] = useState(false);

  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    if (isPendingEmpresaEnrollment(role)) {
      return;
    }
    navigate("/dashboard");
  };

  const rolesList: Role[] = (user?.roles || []).filter(
    (role) =>
      role.contexto !== "empresa" ||
      (role.empresaId != null && role.empresaId !== ""),
  );

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
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              pb: 1,
              // Soft edges on horizontal scroll
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: 3,
                width: "max-content",
                minWidth: "100%",
                justifyContent: "center",
                p: "20px",
                boxSizing: "border-box",
              }}
            >
              {rolesList.map((role) => {
                const pending = isPendingEmpresaEnrollment(role);
                const roleId =
                  role.contexto === "empresa"
                    ? role.empresaId ||
                      role.empresa?.rut ||
                      `empresa-${role.role}`
                    : role.factoringId;
                const currentRoleId =
                  currentRole?.contexto === "empresa"
                    ? currentRole?.empresaId ||
                      currentRole?.empresa?.rut ||
                      (currentRole ? `empresa-${currentRole.role}` : undefined)
                    : currentRole?.factoringId;

                return (
                  <RoleCard
                    key={roleId}
                    roleId={roleId}
                    currentRoleId={currentRoleId}
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
                    isPendingEnrollment={pending}
                  />
                );
              })}

              <DemoCard onClick={() => setDemoOpen(true)} />
            </Box>
          </Box>
        </Box>
      </Box>

      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </Layout>
  );
};

export default RoleSelection;
