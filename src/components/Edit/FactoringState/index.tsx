import { Box, Typography, Chip } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface FactoringStateProps {
  estadoEnrolamiento?: string;
}

type EstadoConfig = {
  label: string;
  color: "warning" | "info" | "success";
  icon: React.ReactNode;
  description: string;
  puedeHacer: string[];
  noPuedeHacer: string[];
};

const estadosConfig: Record<string, EstadoConfig> = {
  PENDIENTE: {
    label: "Pendiente",
    color: "warning",
    icon: <HourglassEmptyIcon sx={{ color: "warning.main", fontSize: 32 }} />,
    description:
      "El factoring ha iniciado su proceso de enrolamiento en FactorLink, pero aún no ha completado la información y documentación requerida.",
    puedeHacer: [
      "Acceder a la plataforma en modo limitado",
      "Completar y editar su información básica",
      "Cargar los documentos legales y comerciales solicitados",
      "Visualizar el estado de su enrolamiento",
    ],
    noPuedeHacer: [
      "Operar dentro de la plataforma como factoring",
      "Acceder a funcionalidades financieras u operativas",
      "Interactuar con empresas o realizar transacciones",
    ],
  },
  VALIDACION: {
    label: "En Validación",
    color: "info",
    icon: <VerifiedUserIcon sx={{ color: "info.main", fontSize: 32 }} />,
    description:
      "El factoring ha enviado toda la información requerida y se encuentra en proceso de revisión y validación por parte del equipo administrador de FactorLink.",
    puedeHacer: [
      "Acceder a la plataforma",
      "Visualizar la información enviada",
      "Consultar el estado de la validación",
      "Recibir notificaciones u observaciones si se requieren ajustes",
    ],
    noPuedeHacer: [
      "Realizar operaciones activas dentro de la plataforma",
      "Ejecutar acciones financieras o comerciales",
      "Interactuar con empresas hasta finalizar la validación",
    ],
  },
  ACTIVO: {
    label: "Activo",
    color: "success",
    icon: <CheckCircleIcon sx={{ color: "success.main", fontSize: 32 }} />,
    description:
      "El factoring ha sido validado y aprobado. Su cuenta se encuentra completamente habilitada para operar dentro de FactorLink.",
    puedeHacer: [
      "Acceder a todas las funcionalidades de la plataforma",
      "Operar como factoring sin restricciones",
      "Interactuar con empresas",
      "Realizar operaciones financieras y comerciales",
      "Visualizar reportes, estados y métricas",
    ],
    noPuedeHacer: [],
  },
};

const FactoringState = ({ estadoEnrolamiento }: FactoringStateProps) => {
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
        {config.icon}

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Estado de Enrolamiento
            </Typography>
            <Chip
              label={config.label}
              size="small"
              sx={{
                backgroundColor: `${config.color}.main`,
                color: "white",
                fontWeight: 500,
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {config.description}
          </Typography>

          {config.puedeHacer.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "success.main", mb: 0.5 }}
              >
                Puede hacer:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {config.puedeHacer.map((item, index) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={index}
                    sx={{ color: "text.secondary" }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {config.noPuedeHacer.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "error.main", mb: 0.5 }}
              >
                No puede hacer:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {config.noPuedeHacer.map((item, index) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={index}
                    sx={{ color: "text.secondary" }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FactoringState;
