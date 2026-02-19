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
        backgroundColor: "white",
        borderRadius: 3,
        mb: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
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
          "&:hover": { backgroundColor: "#F8FAFC" },
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {icon && (
            <Box
              sx={{
                backgroundColor: "#F1F5F9",
                borderRadius: 2,
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
              <Typography variant="body2" sx={{ color: "#64748B" }}>
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
