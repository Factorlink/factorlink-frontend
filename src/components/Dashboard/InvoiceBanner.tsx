import { Box, Typography } from "@mui/material";

const InvoiceBanner = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, var(--color-bg-neutral-primary) 0%, var(--color-bg-accent-primary) 100%)",
        borderRadius: "var(--radius-l)",
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            color: "var(--color-fg-on-neutral-primary)",
            opacity: 0.9,
            fontSize: "var(--font-size-l)",
          }}
        >
          Tienes facturas por un monto de
        </Typography>
        <Typography
          sx={{
            color: "var(--color-fg-success-primary)",
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            fontSize: "var(--font-size-3xl)",
          }}
        >
          $14.546.000
        </Typography>
        <Typography
          sx={{
            color: "var(--color-fg-on-neutral-primary)",
            opacity: 0.9,
            fontSize: "var(--font-size-l)",
          }}
        >
          para ser financiadas
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceBanner;
