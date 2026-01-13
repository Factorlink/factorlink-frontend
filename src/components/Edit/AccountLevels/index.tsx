import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface AccountLevel {
  level: number;
  title: string;
  status: string;
  description: string;
  nextStep: string | null;
}

const ACCOUNT_LEVELS: AccountLevel[] = [
  {
    level: 1,
    title: "Registro",
    status: "Activo al crear la cuenta",
    description:
      "El usuario puede acceder a la plataforma y completar su perfil básico.",
    nextStep:
      "Sincronizar la empresa con el SII y completar datos tributarios.",
  },
  {
    level: 2,
    title: "Empresa Verificada",
    status: "Datos tributarios validados",
    description:
      "El usuario puede operar parcialmente y acceder a funciones ampliadas.",
    nextStep:
      "Subir y enviar la documentación legal requerida para validación.",
  },
  {
    level: 3,
    title: "Cuenta Habilitada",
    status: "Verificación completa",
    description:
      "El usuario puede operar sin restricciones y acceder a todas las funcionalidades de Factor Link.",
    nextStep: null,
  },
];

interface AccountLevelsProps {
  currentLevel?: 1 | 2 | 3;
}

interface LevelItemProps {
  levelData: AccountLevel;
  currentLevel: number;
  isLast: boolean;
}

const LevelItem = ({ levelData, currentLevel, isLast }: LevelItemProps) => {
  const isCompleted = levelData.level < currentLevel;
  const isActive = levelData.level === currentLevel;
  const isPending = levelData.level > currentLevel;

  const getStatusChip = () => {
    if (isCompleted) {
      return (
        <Chip
          label="Completado"
          size="small"
          sx={{
            backgroundColor: "success.main",
            color: "white",
            fontWeight: 500,
            fontSize: 12,
          }}
        />
      );
    }
    if (isActive) {
      return (
        <Chip
          label={levelData.status}
          size="small"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: 500,
            fontSize: 12,
          }}
        />
      );
    }
    return (
      <Chip
        label="Pendiente"
        size="small"
        sx={{
          backgroundColor: "grey.200",
          color: "text.secondary",
          fontWeight: 500,
          fontSize: 12,
        }}
      />
    );
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Icon and connector line */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Step icon */}
        {isCompleted ? (
          <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
        ) : isActive ? (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "success.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {levelData.level}
          </Box>
        ) : (
          <RadioButtonUncheckedIcon
            sx={{ color: "text.secondary", fontSize: 28, opacity: 0.5 }}
          />
        )}
        {/* Connector line */}
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flexGrow: 1,
              minHeight: 40,
              backgroundColor: "grey.300",
              mt: 1,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: isPending ? "text.secondary" : "text.primary",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            Nivel {levelData.level} — {levelData.title}
          </Typography>
          {getStatusChip()}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: levelData.nextStep && isActive ? 1.5 : 0,
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {levelData.description}
        </Typography>

        {levelData.nextStep && isActive && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              backgroundColor: "primary.main",
              borderRadius: 1,
              p: 1.5,
              opacity: 0.9,
              mt: 1.5,
            }}
          >
            <ArrowForwardIcon
              sx={{ color: "white", fontSize: 18, mt: 0.25 }}
            />
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: 500 }}
            >
              Para avanzar: {levelData.nextStep}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const AccountLevels = ({ currentLevel = 1 }: AccountLevelsProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "text.primary",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Niveles de Cuenta
      </Typography>

      <Box>
        {ACCOUNT_LEVELS.map((levelData, index) => (
          <LevelItem
            key={levelData.level}
            levelData={levelData}
            currentLevel={currentLevel}
            isLast={index === ACCOUNT_LEVELS.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AccountLevels;
