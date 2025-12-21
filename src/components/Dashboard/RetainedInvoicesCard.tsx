import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Description, ArrowForward } from "@mui/icons-material";

const RetainedInvoicesCard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Description sx={{ color: "text.secondary" }} />
          <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
            Facturas retenidas
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        {/* Donut Chart */}
        <Box sx={{ position: "relative", width: 140, height: 140 }}>
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke={theme.palette.primary.main}
              strokeWidth="3"
              strokeDasharray="90 10"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke={theme.palette.secondary.main}
              strokeWidth="3"
              strokeDasharray="7.3 92.7"
              strokeDashoffset="-90"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="transparent"
              stroke={theme.palette.success.main}
              strokeWidth="3"
              strokeDasharray="2.7 97.3"
              strokeDashoffset="-97.3"
            />
          </svg>
          {/* Center labels */}
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
                fontSize: "0.7rem",
                color: "text.secondary",
                position: "absolute",
                top: -40,
                left: -20,
              }}
            >
              7.3 %
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "text.secondary",
                position: "absolute",
                top: -45,
                right: -35,
              }}
            >
              90 %
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "text.secondary",
                position: "absolute",
                bottom: -40,
                left: -20,
              }}
            >
              2.7%
            </Typography>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem" }}
            >
              Total factorizado
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "primary.dark",
              }}
            >
              $24.685.000
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem" }}
            >
              Retenciones
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "primary.main",
              }}
            >
              $1.802.005
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem" }}
            >
              Morosidad Acumulada
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "success.main",
              }}
            >
              $666.495
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{ color: "success.main", fontSize: "0.75rem" }}
            >
              Morosidad Hoy
            </Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "success.main",
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
