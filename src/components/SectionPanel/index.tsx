import { Box, Typography } from "@mui/material";

interface SectionPanelProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const titleSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-primary)",
} as const;

const SectionPanel = ({
  title,
  subtitle,
  icon,
  action,
  children,
}: SectionPanelProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: "var(--radius-m)",
        mb: 3,
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border-default-primary)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2.5,
          borderBottom: "1px solid var(--color-border-default-primary)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          {icon && (
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-tertiary)",
                borderRadius: "var(--radius-m)",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            {typeof title === "string" ? (
              <Typography variant="h6" sx={titleSx}>
                {title}
              </Typography>
            ) : (
              title
            )}
            {typeof subtitle === "string" ? (
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                {subtitle}
              </Typography>
            ) : (
              subtitle
            )}
          </Box>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
      <Box sx={{ px: 3, pb: 3, pt: 3 }}>{children}</Box>
    </Box>
  );
};

export default SectionPanel;
