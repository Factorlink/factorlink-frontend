import { Box, Button, Chip, Typography } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { StyledTextField } from "../../../pages/register/styles";
import useAuthStore from "../../../store/authStore";
import { surface } from "../../../theme";
import { isXmlUiEnabled } from "../../../config/featureFlags";

interface SiiPersonalSyncProps {
  isLinked: boolean;
  onLink?: () => void;
  onUpdate?: () => void;
}

const getBenefits = () => {
  if (isXmlUiEnabled()) {
    return [
      "Cesión electrónica de facturas",
      "Obtención automática de XML/DTE",
      "Envío directo a cotización en marketplace",
      "Consulta de estado de cesión en SII",
    ];
  }
  return [
    "Cesión electrónica de facturas",
    "Obtención automática de PDF/DTE",
    "Envío directo a cotización en marketplace",
    "Consulta de estado de cesión en SII",
  ];
};

const readOnlyFieldSx = {
  "& .MuiInputBase-input": {
    color: "text.secondary",
    cursor: "default",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "action.hover",
  },
} as const;

const SiiPersonalSync = ({
  isLinked,
  onLink,
  onUpdate,
}: SiiPersonalSyncProps) => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const benefits = getBenefits();

  return (
    <Box
      sx={{
        ...surface.card,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "var(--radius-m)",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SyncIcon sx={{ color: "common.white", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {isLinked
                ? "Cuenta Personal SII Vinculada"
                : "Cuenta Personal SII"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {isLinked
                ? "Tu cuenta personal del SII ya está vinculada. Ahora puedes realizar las acciones avanzadas desde la plataforma."
                : "Vincula tu cuenta personal del SII para habilitar acciones avanzadas"}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={isLinked ? "Vinculada" : "No vinculada"}
          size="small"
          color={isLinked ? "success" : "error"}
          sx={{
            fontWeight: 600,
            borderRadius: "var(--radius-m)",
            px: 1,
          }}
        />
      </Box>

      {/* Info section */}
      <Box sx={{ mx: 3, mb: 2 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "var(--radius-m)",
            p: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            {isLinked ? (
              <CheckCircleOutlineIcon
                sx={{ fontSize: 20, color: "success.main" }}
              />
            ) : (
              <HelpOutlineIcon sx={{ fontSize: 20, color: "primary.main" }} />
            )}
            <Typography
              variant="subtitle2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {isLinked
                ? "Acciones que ahora puedes realizar"
                : "¿Para qué sirve vincular tu cuenta personal del SII?"}
            </Typography>
          </Box>
          {!isLinked && (
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Al vincular tu cuenta personal del SII a tu empresa, podrás realizar
              acciones adicionales de forma automática directamente desde la
              plataforma.
            </Typography>
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
          >
            {benefits.map((benefit) => (
              <Box
                key={benefit}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 18, color: "success.main" }}
                />
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {benefit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {isLinked && (
        <Box sx={{ mx: 3, mb: 2 }}>
          <Box
            sx={{
              display: "grid",
              padding: { xs: 3, md: 5 },
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box>
              {[
                {
                  label: "RUT Personal",
                  value:
                    empresa?.siiPersonal?.siiRutPersonal ||
                    empresa?.siiRutPersonal ||
                    "",
                },
                {
                  label: "Razón Social",
                  value:
                    empresa?.siiPersonal?.siiRazonSocialPersonal ||
                    empresa?.siiRazonSocialPersonal ||
                    "",
                },
                {
                  label: "Email",
                  value:
                    empresa?.siiPersonal?.siiEmailPersonal ||
                    empresa?.siiEmailPersonal ||
                    "",
                },
                {
                  label: "Dirección",
                  value:
                    empresa?.siiPersonal?.siiDireccionPersonal ||
                    empresa?.siiDireccionPersonal ||
                    "",
                },
              ].map((field) => (
                <StyledTextField
                  key={field.label}
                  fullWidth
                  label={field.label}
                  value={field.value}
                  InputProps={{ readOnly: true }}
                  sx={readOnlyFieldSx}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ px: 3, pb: 3 }}>
        {isLinked ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InfoOutlinedIcon sx={{ fontSize: 20, color: "success.main" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "success.main" }}>
                  Todas las funcionalidades avanzadas están habilitadas
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<VpnKeyOutlinedIcon />}
              onClick={onUpdate}
              sx={{
                textTransform: "none",
                borderRadius: "var(--radius-m)",
                fontWeight: 500,
                backgroundColor: "var(--color-bg-accent-primary)",
                color: "common.white",
                px: 3,
                py: 1.2,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--color-bg-accent-primary-hover)",
                  boxShadow: "none",
                },
              }}
            >
              Cambiar contraseña
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={onLink}
            sx={{
              textTransform: "none",
              borderRadius: "var(--radius-m)",
              fontWeight: 500,
              backgroundColor: "primary.main",
              color: "common.white",
              px: 3,
              py: 1.2,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "primary.dark",
                boxShadow: "none",
              },
            }}
          >
            Vincular cuenta personal SII
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SiiPersonalSync;
