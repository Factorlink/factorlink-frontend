import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const validationItems = [
  "Los documentos pueden estar en estado: PENDIENTE, APROBADO o RECHAZADO",
  "Solo el Super Administrador puede validar o rechazar documentos",
  "Los documentos APROBADOS no pueden ser eliminados ni reemplazados",
  "Los documentos RECHAZADOS pueden ser reemplazados con nuevas versiones",
  "La validación de todos los documentos es necesaria para habilitar operaciones",
];

const ValidationProcessInfo = () => {
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
            backgroundColor: "warning.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.85,
          }}
        >
          <InfoOutlinedIcon sx={{ color: "white", fontSize: 24 }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
            Proceso de Validación
          </Typography>

          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {validationItems.map((item, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  color: "text.secondary",
                  mb: 0.75,
                  "&::marker": {
                    color: "text.secondary",
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ValidationProcessInfo;
