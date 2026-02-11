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
          backgroundColor: "#F8FAFC",
          borderRadius: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#F1F5F9" },
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Visibility sx={{ color: "#00BCD4", fontSize: 20 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1E293B" }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              {subtitle}
            </Typography>
          )}
          <Chip
            label={factorings.length}
            size="small"
            sx={{
              backgroundColor: "#E0F7FA",
              color: "#00838F",
              fontWeight: 700,
              minWidth: 28,
              height: 24,
            }}
          />
        </Box>
        {expanded ? (
          <ExpandLess sx={{ color: "#64748B" }} />
        ) : (
          <ExpandMore sx={{ color: "#64748B" }} />
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
                backgroundColor: "#F8FAFC",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Business sx={{ color: "#00BCD4", fontSize: 20 }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#1E293B" }}
                >
                  {factoring.razonSocial}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  {factoring.rut}
                </Typography>
              </Box>
            </Box>
          ))}
          {factorings.length === 0 && (
            <Typography
              variant="body2"
              sx={{ color: "#94A3B8", textAlign: "center", py: 2 }}
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
