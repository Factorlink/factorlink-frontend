import { Box, Typography, useTheme } from "@mui/material";

const InvoiceBanner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
        borderRadius: 3,
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>
          Tienes facturas por un monto de
        </Typography>
        <Typography
          sx={{
            color: "success.main",
            fontWeight: 700,
            fontSize: "2.5rem",
          }}
        >
          $14.546.000
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>
          para ser financiadas
        </Typography>
      </Box>

      {/* Decorative circles */}
      <Box sx={{ position: "relative", width: 100, height: 80 }}>
        <Box
          sx={{
            position: "absolute",
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "success.main",
            right: 0,
            top: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            right: 30,
            top: 20,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#FFB74D",
            right: 55,
            top: 30,
          }}
        />
      </Box>
    </Box>
  );
};

export default InvoiceBanner;
