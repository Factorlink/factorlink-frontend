import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Clear,
  ExpandLess,
  ExpandMore,
  FilterList,
  Search,
} from "@mui/icons-material";
import {
  INITIAL_GRUPO_FILTERS,
  isGrupoFilterValueActive,
  readGrupoFiltersFromSearchParams,
  type FacturaGruposFiltersValues,
} from "../../utils/facturaGruposFilters";

interface FacturaGruposFiltersProps {
  onApplyFilters: (filters: FacturaGruposFiltersValues) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const FacturaGruposFilters = ({
  onApplyFilters,
  onClearFilters,
  loading = false,
}: FacturaGruposFiltersProps) => {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<FacturaGruposFiltersValues>(() =>
    readGrupoFiltersFromSearchParams(searchParams),
  );
  const [expanded, setExpanded] = useState(() => {
    const initial = readGrupoFiltersFromSearchParams(searchParams);
    return (Object.keys(initial) as Array<keyof FacturaGruposFiltersValues>).some(
      (key) => isGrupoFilterValueActive(initial[key]),
    );
  });

  const hasActiveFilters = (
    Object.keys(values) as Array<keyof FacturaGruposFiltersValues>
  ).some((key) => isGrupoFilterValueActive(values[key]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasActiveFilters) return;
    onApplyFilters(values);
  };

  const handleClear = () => {
    setValues(INITIAL_GRUPO_FILTERS);
    onClearFilters();
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        mb: 3,
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          cursor: "pointer",
          "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FilterList sx={{ color: "var(--color-fg-default-secondary)" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
          >
            Filtros de búsqueda
          </Typography>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{ p: 2, borderTop: "1px solid var(--color-border-default-primary)" }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Nombre"
                value={values.nombre}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, nombre: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="grupos-visibilidad-filter-label">
                  Visibilidad
                </InputLabel>
                <Select
                  labelId="grupos-visibilidad-filter-label"
                  label="Visibilidad"
                  value={values.visibilidad}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      visibilidad: e.target
                        .value as FacturaGruposFiltersValues["visibilidad"],
                    }))
                  }
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                  <MenuItem value="TODOS">Todos los Factorings</MenuItem>
                  <MenuItem value="SELECCIONADOS">
                    Solo Factorings seleccionados
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="% a financiar"
                value={values.porcentajeFinanciamiento}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  if (onlyNums.length > 3) return;
                  if (onlyNums !== "") {
                    const n = Number(onlyNums);
                    if (n < 1 || n > 100) return;
                  }
                  setValues((prev) => ({
                    ...prev,
                    porcentajeFinanciamiento: onlyNums,
                  }));
                }}
                inputProps={{ inputMode: "numeric" }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 2,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Search />}
              disabled={loading || !hasActiveFilters}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "var(--color-fg-on-accent-primary)",
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-accent-primary-hover)",
                },
              }}
            >
              Buscar
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FacturaGruposFilters;
