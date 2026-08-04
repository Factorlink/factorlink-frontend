import { Box, Typography, IconButton } from "@mui/material";
import { Description, ArrowForward } from "@mui/icons-material";

const cardSx = {
  backgroundColor: "var(--color-bg-default-primary)",
  borderRadius: "var(--radius-l)",
  p: 3,
  boxShadow: "var(--shadow-card)",
  border: "1px solid var(--color-border-default-primary)",
};

const iconButtonSx = {
  backgroundColor: "var(--color-bg-accent-primary)",
  color: "var(--color-fg-on-accent-primary)",
  borderRadius: "var(--radius-m)",
  "&:hover": {
    backgroundColor: "var(--color-bg-accent-primary-hover)",
  },
};

const RetainedInvoicesCard = () => {
  return (
    <Box sx={cardSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Description sx={{ color: "var(--color-fg-default-secondary)" }} />
          <Typography
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 500,
              color: "var(--color-fg-default-primary)",
            }}
          >
            Facturas retenidas
          </Typography>
        </Box>
        <IconButton size="small" sx={iconButtonSx} aria-label="Ver más">
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Box sx={{ position: "relative", width: 140, height: 140 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="var(--chart-series-1)"
              strokeWidth="3"
              strokeDasharray="90 10"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="var(--chart-series-2)"
              strokeWidth="3"
              strokeDasharray="7.3 92.7"
              strokeDashoffset="-90"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke="var(--chart-series-singular)"
              strokeWidth="3"
              strokeDasharray="2.7 97.3"
              strokeDashoffset="-97.3"
            />
          </svg>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-fg-default-secondary)",
                position: "absolute",
                top: -40,
                left: -20,
              }}
            >
              7.3 %
            </Typography>
            <Typography
              sx={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-fg-default-secondary)",
                position: "absolute",
                top: -45,
                right: -35,
              }}
            >
              90 %
            </Typography>
            <Typography
              sx={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-fg-default-secondary)",
                position: "absolute",
                bottom: -40,
                left: -20,
              }}
            >
              2.7%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: "var(--font-size-s)",
              }}
            >
              Total factorizado
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-2xl)",
                color: "var(--color-fg-default-primary)",
              }}
            >
              $24.685.000
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: "var(--font-size-s)",
              }}
            >
              Retenciones
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-xl)",
                color: "var(--color-fg-accent-primary)",
              }}
            >
              $1.802.005
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: "var(--color-fg-default-secondary)",
                fontSize: "var(--font-size-s)",
              }}
            >
              Morosidad Acumulada
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-xl)",
                color: "var(--color-fg-success-primary)",
              }}
            >
              $666.495
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "var(--color-fg-success-primary)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              Morosidad Hoy
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-m)",
                color: "var(--color-fg-success-primary)",
              }}
            >
              $38.624
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RetainedInvoicesCard;
