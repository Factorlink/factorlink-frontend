import { Box, Typography, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { surface } from "../../../theme";

interface EmpresaDocumentStatusProps {
  currentLevel?: number;
}

type LevelConfig = {
  chipLabel: string;
  chipColor: "warning" | "info" | "success" | "primary";
  subtitle: string;
  infoMessage: string | null;
};

const levelConfigs: Record<number, LevelConfig> = {
  1: {
    chipLabel: "Nivel 1",
    chipColor: "warning",
    subtitle: "Nivel 1 - Complete la sincronización SII para avanzar al Nivel 2",
    infoMessage:
      "Para avanzar al Nivel 2, complete la sincronización con el SII y valide los datos tributarios de su empresa.",
  },
  2: {
    chipLabel: "Nivel 2",
    chipColor: "primary",
    subtitle: "Nivel 2 - Complete documentación para alcanzar Nivel 3",
    infoMessage:
      "Para alcanzar el Nivel 3 y habilitar todas las funcionalidades, complete la sincronización SII y suba todos los documentos legales requeridos.",
  },
  3: {
    chipLabel: "Nivel 3",
    chipColor: "success",
    subtitle: "Nivel 3 - Documentación completa y verificada",
    infoMessage: null,
  },
};

const EmpresaDocumentStatus = ({
  currentLevel = 1,
}: EmpresaDocumentStatusProps) => {
  const config = levelConfigs[currentLevel];

  return (
    <Box
      sx={{
        ...surface.card,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-m)",
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
              Empresa - Estado de Documentación
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
                borderRadius: "var(--radius-m)",
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

export default EmpresaDocumentStatus;
