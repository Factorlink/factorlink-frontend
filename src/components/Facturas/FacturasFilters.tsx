import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
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
  FormHelperText,
} from "@mui/material";
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
} from "@mui/icons-material";
import { FACTURAS_STATES, INITIAL_FILTERS } from "../../utils/consts";
import { facturasFiltersSchema } from "./validation-schema";
import { handleRutInputChange } from "../../utils/validations/shared-fields";

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
  sortBy: string;
  order: string;
}

interface FacturasFiltersProps {
  onApplyFilters: (filters: FacturasFiltersValues) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const FacturasFilters = ({
  onApplyFilters,
  onClearFilters,
  loading = false,
}: FacturasFiltersProps) => {
  const [expanded, setExpanded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialValues = () => {
    const newFilters = { ...INITIAL_FILTERS };
    (Object.keys(INITIAL_FILTERS) as Array<keyof FacturasFiltersValues>).forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        newFilters[key] = value;
      }
    });
    return newFilters;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: facturasFiltersSchema,
    onSubmit: (values) => {
      onApplyFilters(values);
    },
  });

  const handleClear = () => {
    formik.resetForm({ values: INITIAL_FILTERS });
    setSearchParams(new URLSearchParams());
    onClearFilters();
  };

  const hasActiveFilters = Object.values(formik.values).some((val) => val !== "" && val !== "ASC" && val !== "DESC");

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
              {Object.values(formik.values).filter((val) => val !== "" && val !== "ASC" && val !== "DESC").length}
            </Box>
          )}
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 0, borderTop: "1px solid #E2E8F0" }} component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Folio */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="folio"
                label="Folio"
                placeholder="Número de folio"
                value={formik.values.folio}
                onChange={formik.handleChange}
                error={formik.touched.folio && Boolean(formik.errors.folio)}
                helperText={formik.touched.folio && formik.errors.folio}
              />
            </Grid>

            {/* RUT Emisor */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="rutEmisor"
                label="RUT Emisor"
                placeholder="Ej: 12.345.678-9"
                value={formik.values.rutEmisor}
                onChange={(e) => handleRutInputChange(e as React.ChangeEvent<HTMLInputElement>, formik.setFieldValue)}
                error={formik.touched.rutEmisor && Boolean(formik.errors.rutEmisor)}
                helperText={formik.touched.rutEmisor && formik.errors.rutEmisor}
              />
            </Grid>

            {/* RUT Receptor */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="rutReceptor"
                label="RUT Receptor"
                placeholder="Ej: 12.345.678-9"
                value={formik.values.rutReceptor}
                onChange={(e) => handleRutInputChange(e as React.ChangeEvent<HTMLInputElement>, formik.setFieldValue)}
                error={formik.touched.rutReceptor && Boolean(formik.errors.rutReceptor)}
                helperText={formik.touched.rutReceptor && formik.errors.rutReceptor}
              />
            </Grid>

            {/* Razón Social Receptor */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="razonSocialReceptor"
                label="Razón Social Receptor"
                placeholder="Nombre empresa"
                value={formik.values.razonSocialReceptor}
                onChange={formik.handleChange}
                error={formik.touched.razonSocialReceptor && Boolean(formik.errors.razonSocialReceptor)}
                helperText={formik.touched.razonSocialReceptor && formik.errors.razonSocialReceptor}
              />
            </Grid>

            {/* Estado */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <FormControl fullWidth size="small" error={formik.touched.estado && Boolean(formik.errors.estado)}>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formik.values.estado}
                  label="Estado"
                  onChange={formik.handleChange}
                >
                  {FACTURAS_STATES.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.estado && formik.errors.estado && (
                  <FormHelperText>{formik.errors.estado}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Monto Total */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="montoTotal"
                label="Monto Total"
                type="number"
                placeholder="Monto exacto"
                value={formik.values.montoTotal}
                onChange={formik.handleChange}
                error={formik.touched.montoTotal && Boolean(formik.errors.montoTotal)}
                helperText={formik.touched.montoTotal && formik.errors.montoTotal}
              />
            </Grid>

            {/* Min Monto Total */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="minMontoTotal"
                label="Monto Total Mínimo"
                type="number"
                placeholder="Desde"
                value={formik.values.minMontoTotal}
                onChange={formik.handleChange}
                error={formik.touched.minMontoTotal && Boolean(formik.errors.minMontoTotal)}
                helperText={formik.touched.minMontoTotal && formik.errors.minMontoTotal}
              />
            </Grid>

            {/* Max Monto Total */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="maxMontoTotal"
                label="Monto Total Máximo"
                type="number"
                placeholder="Hasta"
                value={formik.values.maxMontoTotal}
                onChange={formik.handleChange}
                error={formik.touched.maxMontoTotal && Boolean(formik.errors.maxMontoTotal)}
                helperText={formik.touched.maxMontoTotal && formik.errors.maxMontoTotal}
              />
            </Grid>

            {/* Monto Neto */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="montoNeto"
                label="Monto Neto"
                type="number"
                placeholder="Monto exacto"
                value={formik.values.montoNeto}
                onChange={formik.handleChange}
                error={formik.touched.montoNeto && Boolean(formik.errors.montoNeto)}
                helperText={formik.touched.montoNeto && formik.errors.montoNeto}
              />
            </Grid>

            {/* Min Monto Neto */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="minMontoNeto"
                label="Monto Neto Mínimo"
                type="number"
                placeholder="Desde"
                value={formik.values.minMontoNeto}
                onChange={formik.handleChange}
                error={formik.touched.minMontoNeto && Boolean(formik.errors.minMontoNeto)}
                helperText={formik.touched.minMontoNeto && formik.errors.minMontoNeto}
              />
            </Grid>

            {/* Max Monto Neto */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="maxMontoNeto"
                label="Monto Neto Máximo"
                type="number"
                placeholder="Hasta"
                value={formik.values.maxMontoNeto}
                onChange={formik.handleChange}
                error={formik.touched.maxMontoNeto && Boolean(formik.errors.maxMontoNeto)}
                helperText={formik.touched.maxMontoNeto && formik.errors.maxMontoNeto}
              />
            </Grid>

            {/* Monto IVA */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="detalleIva"
                label="Monto IVA"
                type="number"
                placeholder="Monto exacto"
                value={formik.values.detalleIva}
                onChange={formik.handleChange}
                error={formik.touched.detalleIva && Boolean(formik.errors.detalleIva)}
                helperText={formik.touched.detalleIva && formik.errors.detalleIva}
              />
            </Grid>

            {/* Min Detalle IVA */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="minDetalleIva"
                label="IVA Mínimo"
                type="number"
                placeholder="Desde"
                value={formik.values.minDetalleIva}
                onChange={formik.handleChange}
                error={formik.touched.minDetalleIva && Boolean(formik.errors.minDetalleIva)}
                helperText={formik.touched.minDetalleIva && formik.errors.minDetalleIva}
              />
            </Grid>

            {/* Max Detalle IVA */}
            <Grid size={{ xs: 12, sm: 8, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                name="maxDetalleIva"
                label="IVA Máximo"
                type="number"
                placeholder="Hasta"
                value={formik.values.maxDetalleIva}
                onChange={formik.handleChange}
                error={formik.touched.maxDetalleIva && Boolean(formik.errors.maxDetalleIva)}
                helperText={formik.touched.maxDetalleIva && formik.errors.maxDetalleIva}
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
              onClick={() => formik.handleSubmit()}
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
