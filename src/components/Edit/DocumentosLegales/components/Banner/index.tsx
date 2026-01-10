import { Box, Typography, Chip } from "@mui/material";
import useAuthStore from "../../../../../store/authStore";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type EnrollmentStatus = "PENDIENTE" | "EN_VALIDACION" | "ACTIVO";

const Banner = () => {
  const { currentRole } = useAuthStore();

  const enrollmentStatus: EnrollmentStatus =
    (currentRole &&
      currentRole.contexto &&
      (currentRole as any)[currentRole.contexto]?.estadoEnrolamiento) ||
    "PENDIENTE";

  const statusConfig = {
    PENDIENTE: {
      label: "Pendiente",
      color: "warning" as const,
      icon: <HourglassEmptyIcon />,
    },
    EN_VALIDACION: {
      label: "En validación",
      color: "info" as const,
      icon: <VerifiedIcon />,
    },
    ACTIVO: {
      label: "Activo",
      color: "success" as const,
      icon: <CheckCircleIcon />,
    },
  };

  return (
    <Box sx={{ flex: 1 }}>
      {currentRole?.contexto === "empresa" && (
        <>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Gestión de documentos legales del factoring.
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "background.default",
              borderRadius: 2,
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              marginBottom: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Nivel:
              </Typography>
              <Chip
                label={currentRole?.nivel || "No especificado"}
                color="primary"
                variant="filled"
                size="medium"
              />
            </Box>
          </Box>
        </>
      )}

      {currentRole?.contexto === "factoring" && (
        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Gestión de documentos legales del factoring.
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          backgroundColor: "background.default",
          borderRadius: 2,
          p: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Estado de Enrolamiento:
          </Typography>
          <Chip
            icon={statusConfig[enrollmentStatus].icon}
            label={statusConfig[enrollmentStatus].label}
            color={statusConfig[enrollmentStatus].color}
            variant="filled"
            size="medium"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Banner;
