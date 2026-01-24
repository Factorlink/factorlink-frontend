import { Box, Typography, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface FactoringDocumentStatusProps {
  estadoEnrolamiento?: string;
}

type EstadoConfig = {
  chipLabel: string;
  chipColor: "warning" | "info" | "success" | "primary";
  subtitle: string;
  infoMessage: string | null;
};

const estadosConfig: Record<string, EstadoConfig> = {
  PENDIENTE: {
    chipLabel: "Pendiente",
    chipColor: "warning",
    subtitle: "Pendiente - Complete la información y documentación requerida",
    infoMessage:
      "Para avanzar en el proceso de enrolamiento, complete su información básica y cargue todos los documentos legales y comerciales solicitados.",
  },
  VALIDACION: {
    chipLabel: "En Validación",
    chipColor: "primary",
    subtitle: "En Validación - Documentación en proceso de revisión",
    infoMessage:
      "Su documentación está siendo revisada por el equipo administrador. Recibirá notificaciones si se requieren ajustes adicionales.",
  },
  ACTIVO: {
    chipLabel: "Activo",
    chipColor: "success",
    subtitle: "Activo - Documentación completa y aprobada",
    infoMessage: null,
  },
};

const FactoringDocumentStatus = ({
  estadoEnrolamiento,
}: FactoringDocumentStatusProps) => {
  const config = estadoEnrolamiento ? estadosConfig[estadoEnrolamiento] : null;

  if (!config) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.85,
          }}
        >
          <DescriptionIcon sx={{ color: "white", fontSize: 24 }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Factoring - Estado de Documentación
            </Typography>
            <Chip
              label={config.chipLabel}
              size="small"
              sx={{
                backgroundColor: `${config.chipColor}.main`,
                color: "white",
                fontWeight: 500,
                fontSize: 12,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: config.infoMessage ? 2 : 0 }}
          >
            {config.subtitle}
          </Typography>

          {config.infoMessage && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                backgroundColor: "primary.main",
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <InfoOutlinedIcon
                sx={{ color: "white", fontSize: 20, mt: 0.1 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "white", fontWeight: 500 }}
              >
                {config.infoMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FactoringDocumentStatus;
