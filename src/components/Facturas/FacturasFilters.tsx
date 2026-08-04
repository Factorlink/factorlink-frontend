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
import { handleRutInputChange, handlePositiveNumberInputChange } from "../../utils/validations/shared-fields";

// Bloquea teclas no numéricas en campos numéricos (evita +, -, ., e, etc.)
const blockNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End", "Enter"];
  if (allowedKeys.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

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
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        mb: 3,
        boxShadow: "var(--shadow-card)",
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
          "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FilterList sx={{ color: "var(--color-fg-default-secondary)" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
            Filtros de búsqueda
          </Typography>
          {hasActiveFilters && (
            <Box
              sx={{
                backgroundColor: "var(--color-bg-accent-primary)",
                color: "var(--color-fg-on-accent-primary)",
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
        <Box sx={{ p: 2, pt: 0, borderTop: "1px solid var(--color-border-default-primary)" }} component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Folio */}
            <Grid size={{ xs: 12, sm: 8, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                name="folio"
                label="Folio"
                inputMode="numeric"
                placeholder="Número de folio"
                value={formik.values.folio}
                onChange={(e) => handlePositiveNumberInputChange(e as React.ChangeEvent<HTMLInputElement>, formik.setFieldValue)}
                onKeyDown={blockNonNumericKeys}
                error={formik.touched.folio && Boolean(formik.errors.folio)}
                helperText={formik.touched.folio && formik.errors.folio}
                onBlur={formik.handleBlur}
              />
            </Grid>

            {/* RUT Receptor */}
            <Grid size={{ xs: 12, sm: 8, md: 3 }}>
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
                onBlur={formik.handleBlur}
              />
            </Grid>

            {/* Razón Social Receptor */}
            <Grid size={{ xs: 12, sm: 8, md: 3 }}>
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
                onBlur={formik.handleBlur}
              />
            </Grid>

            {/* Estado */}
            <Grid size={{ xs: 12, sm: 8, md: 3 }}>
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
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: "1px solid var(--color-border-default-primary)",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={loading}
              sx={{
                borderColor: "var(--color-border-default-primary)",
                color: "var(--color-fg-default-secondary)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "var(--color-fg-default-tertiary)",
                  backgroundColor: "var(--color-bg-default-tertiary)",
                },
              }}
            >
              Limpiar filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={() => formik.handleSubmit()}
              disabled={loading || formik.isSubmitting || !formik.isValid}
              sx={{
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                color: "var(--color-fg-on-accent-primary)",
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
