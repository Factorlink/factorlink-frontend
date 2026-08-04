import { useState } from "react";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

interface CollapsibleSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection = ({
  title,
  subtitle,
  icon,
  defaultExpanded = false,
  children,
}: CollapsibleSectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: "var(--radius-l)",
        mb: 3,
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border-default-primary)",
        overflow: "hidden",
      }}
    >
      <Box
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "var(--color-bg-default-primary-hover)",
          },
          transition:
            "background-color var(--duration-fast) var(--easing-ease)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {icon && (
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-tertiary)",
                borderRadius: "var(--radius-m)",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            {title}

            {subtitle && (
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton size="small" sx={{ pointerEvents: "none" }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 3, pb: 3 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;
