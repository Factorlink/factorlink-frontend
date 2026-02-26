import { Box, Button, Chip, Typography } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { StyledTextField } from "../../../pages/register/styles";
import useAuthStore from "../../../store/authStore";

interface SiiPersonalSyncProps {
  isLinked: boolean;
  onLink?: () => void;
  onUpdate?: () => void;
  onUnlink?: () => void;
}

const benefits = [
  "Cesión electrónica de facturas",
  "Obtención automática de XML/DTE",
  "Envío directo a cotización en marketplace",
  "Consulta de estado de cesión en SII",
];

const SiiPersonalSync = ({
  isLinked,
  onLink,
  onUpdate,
  onUnlink,
}: SiiPersonalSyncProps) => {
  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
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
              borderRadius: 2,
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
              Cuenta Personal SII Vinculada
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Vincula tu cuenta personal del SII para habilitar acciones
              avanzadas
            </Typography>
          </Box>
        </Box>
        <Chip
          label={isLinked ? "Vinculada" : "No vinculada"}
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 1,
            color: "white",
            ...(isLinked
              ? {
                  backgroundColor: "success.light",
                  "& .MuiChip-icon": { color: "success.dark" },
                }
              : {
                  backgroundColor: "error.light",
                }),
          }}
        />
      </Box>

      {/* Info section */}
      <Box sx={{ mx: 3, mb: 2 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <HelpOutlineIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography
              variant="subtitle2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              ¿Para qué sirve vincular tu cuenta personal del SII?
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Al vincular tu cuenta personal del SII a tu empresa, podrás realizar
            acciones adicionales de forma automática directamente desde la
            plataforma.
          </Typography>
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
                { label: "RUT Personal", value: empresa?.siiRutPersonal || "" },
                {
                  label: "Razón Social",
                  value: empresa?.siiRazonSocialPersonal || "",
                },
                { label: "Email", value: empresa?.siiEmailPersonal || "" },
                {
                  label: "Dirección",
                  value: empresa?.siiDireccionPersonal || "",
                },
              ].map((field) => (
                <StyledTextField
                  key={field.label}
                  fullWidth
                  label={field.label}
                  value={field.value}
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "text.secondary",
                      cursor: "default",
                    },
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "action.hover",
                    },
                  }}
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
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                onClick={onUpdate}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 500,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": { borderColor: "text.secondary" },
                }}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<LinkOffIcon />}
                onClick={onUnlink}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 500,
                  backgroundColor: "error.main",
                  color: "common.white",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "error.dark",
                    boxShadow: "none",
                  },
                }}
              >
                Desvincular
              </Button>
            </Box>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={onLink}
            sx={{
              textTransform: "none",
              borderRadius: 2,
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
