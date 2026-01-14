import { Box, Typography, Chip } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface FactoringStateProps {
  estadoEnrolamiento?: string;
}

const FactoringState = ({ estadoEnrolamiento }: FactoringStateProps) => {
  const isPendiente = estadoEnrolamiento === "PENDIENTE";

  if (!isPendiente) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        p: 3,
        display: "flex",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 0.5,
        }}
      >
        <HourglassEmptyIcon sx={{ color: "warning.main", fontSize: 32 }} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              fontWeight: 600
            }}
          >
            Estado de enrolamiento
          </Typography>
          <Chip
            label="Pendiente"
            size="small"
            sx={{
              mt: 1,
              backgroundColor: "warning.main",
              color: "common.white",
              fontWeight: 500,
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Tu cuenta de factoring se encuentra actualmente en estado pendiente de
          validación. Durante este proceso, el acceso a las funcionalidades
          completas de la plataforma Factorlink estará limitado.
        </Typography>

      </Box>
    </Box>
  );
};

export default FactoringState;
