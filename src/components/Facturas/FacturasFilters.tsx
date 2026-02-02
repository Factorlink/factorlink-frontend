import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { FACTURAS_STATES } from "../../utils/consts";

export interface FacturasFiltersValues {
  rutEmisor: string;
  rutReceptor: string;
  razonSocialReceptor: string;
  montoTotal: string;
  minMontoTotal: string;
  maxMontoTotal: string;
  montoNeto: string;
  minMontoNeto: string;
  maxMontoNeto: string;
  detalleIva: string;
  minDetalleIva: string;
  maxDetalleIva: string;
  folio: string;
  estado: string;
}

interface FacturasFiltersProps {
  onApplyFilters: (filters: FacturasFiltersValues) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const INITIAL_FILTERS: FacturasFiltersValues = {
  rutEmisor: "",
  rutReceptor: "",
  razonSocialReceptor: "",
  montoTotal: "",
  minMontoTotal: "",
  maxMontoTotal: "",
  montoNeto: "",
  minMontoNeto: "",
  maxMontoNeto: "",
  detalleIva: "",
  minDetalleIva: "",
  maxDetalleIva: "",
  folio: "",
  estado: "",
};


const FacturasFilters = ({
  onApplyFilters,
  onClearFilters,
  loading = false,
}: FacturasFiltersProps) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<FacturasFiltersValues>(INITIAL_FILTERS);

  const handleTextChange = (field: keyof FacturasFiltersValues) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof FacturasFiltersValues) => (
    e: SelectChangeEvent
  ) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 3,
        mb: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          cursor: "pointer",
          "&:hover": { backgroundColor: "#F8FAFC" },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FilterList sx={{ color: "#64748B" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1E293B" }}>
            Filtros de búsqueda
          </Typography>
          {hasActiveFilters && (
            <Box
              sx={{
                backgroundColor: "#00BCD4",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {Object.values(filters).filter((val) => val !== "").length}
            </Box>
          )}
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 0, borderTop: "1px solid #E2E8F0" }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Folio */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Folio"
                placeholder="Número de folio"
                value={filters.folio}
                onChange={handleTextChange("folio")}
              />
            </Grid>

            {/* RUT Emisor */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="RUT Emisor"
                placeholder="Ej: 12.345.678-9"
                value={filters.rutEmisor}
                onChange={handleTextChange("rutEmisor")}
              />
            </Grid>

            {/* RUT Receptor */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="RUT Receptor"
                placeholder="Ej: 12.345.678-9"
                value={filters.rutReceptor}
                onChange={handleTextChange("rutReceptor")}
              />
            </Grid>

            {/* Razón Social Receptor */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Razón Social Receptor"
                placeholder="Nombre empresa"
                value={filters.razonSocialReceptor}
                onChange={handleTextChange("razonSocialReceptor")}
              />
            </Grid>

            {/* Estado */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  label="Estado"
                  onChange={handleSelectChange("estado")}
                >
                  {FACTURAS_STATES.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Monto Total */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto Total"
                type="number"
                placeholder="Monto exacto"
                value={filters.montoTotal}
                onChange={handleTextChange("montoTotal")}
              />
            </Grid>

            {/* Min Monto Total */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto Total Mínimo"
                type="number"
                placeholder="Desde"
                value={filters.minMontoTotal}
                onChange={handleTextChange("minMontoTotal")}
              />
            </Grid>

            {/* Max Monto Total */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto Total Máximo"
                type="number"
                placeholder="Hasta"
                value={filters.maxMontoTotal}
                onChange={handleTextChange("maxMontoTotal")}
              />
            </Grid>

            {/* Monto Neto */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto Neto"
                type="number"
                placeholder="Monto exacto"
                value={filters.montoNeto}
                onChange={handleTextChange("montoNeto")}
              />
            </Grid>

            {/* Min Monto Neto */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto Neto Mínimo"
                type="number"
                placeholder="Desde"
                value={filters.minMontoNeto}
                onChange={handleTextChange("minMontoNeto")}
              />
            </Grid>

            {/* Max Monto Neto */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Monto Neto Máximo"
                type="number"
                placeholder="Hasta"
                value={filters.maxMontoNeto}
                onChange={handleTextChange("maxMontoNeto")}
              />
            </Grid>

            {/* Detalle IVA */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Detalle IVA"
                type="number"
                placeholder="Monto exacto"
                value={filters.detalleIva}
                onChange={handleTextChange("detalleIva")}
              />
            </Grid>

            {/* Min Detalle IVA */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="IVA Mínimo"
                type="number"
                placeholder="Desde"
                value={filters.minDetalleIva}
                onChange={handleTextChange("minDetalleIva")}
              />
            </Grid>

            {/* Max Detalle IVA */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="IVA Máximo"
                type="number"
                placeholder="Hasta"
                value={filters.maxDetalleIva}
                onChange={handleTextChange("maxDetalleIva")}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={loading}
              sx={{
                borderColor: "#E2E8F0",
                color: "#64748B",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#CBD5E1",
                  backgroundColor: "#F8FAFC",
                },
              }}
            >
              Limpiar filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleApply}
              disabled={loading}
              sx={{
                backgroundColor: "#00BCD4",
                "&:hover": { backgroundColor: "#00ACC1" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                color: "#fff",
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

export default FacturasFilters;
