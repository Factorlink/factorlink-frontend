import { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import {
  Visibility,
  ExpandMore,
  ExpandLess,
  Business,
} from "@mui/icons-material";
import type { Factoring } from "../../types/factoring";

interface FactoringsListProps {
  factorings: Factoring[];
  title?: string;
  subtitle?: string;
}

const FactoringsList = ({
  factorings,
  title = "Factorings seleccionados",
  subtitle,
}: FactoringsListProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          backgroundColor: "var(--color-bg-default-tertiary)",
          borderRadius: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Visibility sx={{ color: "var(--color-fg-accent-primary)", fontSize: 20 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              {subtitle}
            </Typography>
          )}
          <Chip
            label={factorings.length}
            size="small"
            sx={{
              backgroundColor: "var(--color-bg-accent-secondary)",
              color: "var(--color-fg-accent-primary)",
              fontWeight: 700,
              minWidth: 28,
              height: 24,
            }}
          />
        </Box>
        {expanded ? (
          <ExpandLess sx={{ color: "var(--color-fg-default-secondary)" }} />
        ) : (
          <ExpandMore sx={{ color: "var(--color-fg-default-secondary)" }} />
        )}
      </Box>

      {expanded && (
        <Box
          sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}
        >
          {factorings.map((factoring, index) => (
            <Box
              key={factoring.id || index}
              sx={{
                backgroundColor: "var(--color-bg-default-tertiary)",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Business sx={{ color: "var(--color-fg-accent-primary)", fontSize: 20 }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                >
                  {factoring.razonSocial}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  {factoring.rut}
                </Typography>
              </Box>
            </Box>
          ))}
          {factorings.length === 0 && (
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-tertiary)", textAlign: "center", py: 2 }}
            >
              No hay factorings seleccionados
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FactoringsList;
