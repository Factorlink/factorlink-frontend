import { Box, Typography, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { surface } from "../../../theme";

interface AccountStatusProps {
  isActive?: boolean;
}

const AccountStatus = ({ isActive }: AccountStatusProps) => {
  return (
    <Box
      sx={{
        ...surface.card,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        {isActive ? (
          <CheckCircleIcon sx={{ color: "success.main", fontSize: 32 }} />
        ) : (
          <CancelIcon sx={{ color: "error.main", fontSize: 32 }} />
        )}

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Estado de la Cuenta
            </Typography>
            <Chip
              label={isActive ? "Activo" : "Inactivo"}
              size="small"
              sx={{
                backgroundColor: isActive ? "success.main" : "error.main",
                color: "white",
                fontWeight: 500,
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {isActive
              ? "Tu cuenta está activa y puedes acceder a todas las funcionalidades disponibles según tu nivel de verificación."
              : "Tu cuenta está actualmente inactiva. Algunas funcionalidades pueden estar restringidas."}
          </Typography>

          {!isActive && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                backgroundColor: "error.main",
                borderRadius: 1,
                p: 1.5,
                mt: 1.5,
              }}
            >
              <ArrowForwardIcon sx={{ color: "white", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
                Para reactivar: Contacta a soporte o completa los pasos pendientes.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountStatus;
