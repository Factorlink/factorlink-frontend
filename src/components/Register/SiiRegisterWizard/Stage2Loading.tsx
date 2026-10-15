import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import logo from "../../../assets/png/factorlink-logo.png";
import {
  authCenteredPageSx,
  authLogoImgSx,
  authTitleSx,
} from "../../../theme";

const CHECKLIST_ITEMS = [
  "Validando credenciales del SII",
  "Obteniendo tus datos personales",
  "Cargando tus empresas asociadas",
  "Configurando tu cuenta",
] as const;

/** Slower cadence so the checklist keeps progressing while the SII API responds. */
const STEP_INTERVAL_MS = 2500;

interface Stage2LoadingProps {
  /** How many checklist items to mark complete (0–4). Driven by parent timer. */
  completedCount?: number;
}

const Stage2Loading = ({ completedCount = 0 }: Stage2LoadingProps) => {
  return (
    <Box sx={authCenteredPageSx}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "var(--color-bg-default-primary)",
          borderRadius: "var(--radius-l)",
          boxShadow: "var(--shadow-popover)",
          border: "1px solid var(--color-border-default-primary)",
          px: 3,
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="factorlink"
            sx={{ ...authLogoImgSx, mb: 3 }}
          />
          <CircularProgress
            size={48}
            sx={{ color: "var(--color-fg-accent-primary)" }}
          />
        </Box>

        <Typography component="h1" sx={{ ...authTitleSx, mb: 1.5 }}>
          Estamos creando tu cuenta
        </Typography>
        <Typography
          sx={{
            color: "var(--color-fg-default-secondary)",
            fontSize: "var(--font-size-s)",
            mb: 3,
            px: 1,
          }}
        >
          Estamos validando tus credenciales del SII y obteniendo tu
          información. Este proceso puede tardar unos segundos.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            textAlign: "left",
            width: "100%",
          }}
        >
          {CHECKLIST_ITEMS.map((label, index) => {
            const done = index < completedCount;
            return (
              <Box
                key={label}
                sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
              >
                {done ? (
                  <CheckCircleIcon
                    sx={{
                      color: "var(--color-fg-accent-primary)",
                      fontSize: 22,
                    }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{
                      color: "var(--color-fg-disabled-primary)",
                      fontSize: 22,
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontSize: "var(--font-size-s)",
                    color: done
                      ? "var(--color-fg-default-primary)"
                      : "var(--color-fg-default-secondary)",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

/** Cosmetic progress for the 4 checklist items while a single request runs. */
export function useChecklistProgress(active: boolean) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCompletedCount(0);
      return;
    }

    setCompletedCount(0);
    const id = window.setInterval(() => {
      setCompletedCount((prev) => {
        if (prev >= CHECKLIST_ITEMS.length - 1) {
          window.clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [active]);

  return completedCount;
}

export default Stage2Loading;
