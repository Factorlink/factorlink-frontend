import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  IconButton,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";
import type { Role } from "../../../types/role";
import Layout from "../../../components/Layout";
import RoleCard from "./components/role-card";
import SiiSyncModal from "../../../components/Modals/SiiSyncModal";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user, currentRole, setCurrentRole } = useAuthStore();
  const [siiModalOpen, setSiiModalOpen] = useState(false);

  const handleSelectRole = (role: Role) => {
    setCurrentRole(role);
    navigate("/dashboard");
  };

  const rolesList: Role[] = user?.roles || [];

  return (
    <Layout hideSuite={true} hideMenu={true}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#3B4D61",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Main Content */}
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
              color: "white",
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
            }}
          >
            Selecciona una Entidad
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              mb: 6,
              textAlign: "center",
            }}
          >
            Elige el rol con el que deseas iniciar sesión
          </Typography>

          {/* Cards Grid */}
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

            {/* Agregar Empresa SII Card */}
            {(currentRole?.contexto === "empresa" ||
              user?.roles?.some((role) => role.contexto === "empresa")) && (
              <Card
                sx={{
                  width: 280,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "2px dashed rgba(255,255,255,0.3)",
                  boxShadow: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => setSiiModalOpen(true)}
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 180,
                  }}
                >
                  <IconButton
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      mb: 2,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <Add sx={{ color: "white", fontSize: 32 }} />
                  </IconButton>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1rem",
                      mb: 0.5,
                    }}
                  >
                    Agregar Empresa
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Sincroniza con SII
                  </Typography>
                </CardActionArea>
              </Card>
            )}
          </Box>
        </Box>
      </Box>

      <SiiSyncModal
        open={siiModalOpen}
        onClose={() => setSiiModalOpen(false)}
      />
    </Layout>
  );
};

export default RoleSelection;
