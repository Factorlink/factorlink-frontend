import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import {
  Autocomplete,
  Box,
  Typography,
  TextField,
  Button,
  Collapse,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
  Check,
  Refresh,
} from "@mui/icons-material";
import { FACTURAS_STATES, INITIAL_FILTERS } from "../../utils/consts";
import { facturasFiltersSchema } from "./validation-schema";
import { handleRutInputChange, handlePositiveNumberInputChange } from "../../utils/validations/shared-fields";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";

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
  razonSocialReceptor: string[];
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
  estado: string[];
  sortBy: string;
  order: string;
}

export const ARRAY_FILTER_KEYS = ["estado", "razonSocialReceptor"] as const;

export type FacturasArrayFilterKey = (typeof ARRAY_FILTER_KEYS)[number];

export const isArrayFilterKey = (
  key: keyof FacturasFiltersValues,
): key is FacturasArrayFilterKey =>
  (ARRAY_FILTER_KEYS as readonly string[]).includes(key);

export const isFilterValueActive = (
  value: FacturasFiltersValues[keyof FacturasFiltersValues],
): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== "" && value !== "ASC" && value !== "DESC";
};

const chipSx = {
  backgroundColor: "var(--color-bg-accent-secondary)",
  color: "var(--color-fg-accent-primary)",
  fontWeight: 500,
};

const autocompleteFilterSx = {
  "& .MuiAutocomplete-inputRoot": {
    flexWrap: "nowrap",
  },
  "& .MuiAutocomplete-input": {
    minWidth: 0,
    width: 0,
  },
};

interface FacturasFiltersProps {
  onApplyFilters: (filters: FacturasFiltersValues) => void;
  onClearFilters: () => void;
  loading?: boolean;
  hideEstado?: boolean;
}

const FacturasFilters = ({
  onApplyFilters,
  onClearFilters,
  loading = false,
  hideEstado = false,
}: FacturasFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setExpanded] = useState(() =>
    (Object.keys(INITIAL_FILTERS) as Array<keyof FacturasFiltersValues>).some((key) => {
      if (key === "sortBy" || key === "order") return false;
      if (hideEstado && key === "estado") return false;
      if (isArrayFilterKey(key)) return searchParams.getAll(key).length > 0;
      const value = searchParams.get(key);
      return value !== null && isFilterValueActive(value);
    }),
  );
  const { currentRole } = useAuthStore();
  const { getRazonesSociales } = useFacturas();

  const [razonesSociales, setRazonesSociales] = useState<string[]>([]);
  const [loadingRazones, setLoadingRazones] = useState(false);
  const [razonesError, setRazonesError] = useState(false);
  const lastEmpresaIdRef = useRef<string | undefined>(undefined);
  const getRazonesSocialesRef = useRef(getRazonesSociales);
  getRazonesSocialesRef.current = getRazonesSociales;

  const fetchRazonesSociales = useCallback(async (empresaId: string) => {
    try {
      setLoadingRazones(true);
      setRazonesError(false);
      const data = await getRazonesSocialesRef.current(empresaId);
      setRazonesSociales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching razones sociales:", err);
      setRazonesSociales([]);
      setRazonesError(true);
    } finally {
      setLoadingRazones(false);
    }
  }, []);

  useEffect(() => {
    const empresaId = currentRole?.empresaId;
    if (!empresaId) {
      setRazonesSociales([]);
      setRazonesError(false);
      lastEmpresaIdRef.current = undefined;
      return;
    }
    if (lastEmpresaIdRef.current === empresaId) return;
    lastEmpresaIdRef.current = empresaId;
    fetchRazonesSociales(empresaId);
  }, [currentRole?.empresaId, fetchRazonesSociales]);

  const getInitialValues = (): FacturasFiltersValues => {
    const newFilters = { ...INITIAL_FILTERS };
    (Object.keys(INITIAL_FILTERS) as Array<keyof FacturasFiltersValues>).forEach((key) => {
      if (isArrayFilterKey(key)) {
        const values = searchParams.getAll(key);
        if (values.length > 0) {
          newFilters[key] = values;
        }
        return;
      }
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
    onSubmit: (values, { setSubmitting }) => {
      if (!Object.values(values).some(isFilterValueActive)) {
        setSubmitting(false);
        return;
      }
      onApplyFilters(values);
      setSubmitting(false);
    },
  });

  const handleClear = () => {
    formik.resetForm({ values: INITIAL_FILTERS });
    setSearchParams(new URLSearchParams());
    onClearFilters();
  };

  const getEstadoLabel = (value: string) =>
    FACTURAS_STATES.find((estado) => estado.value === value)?.label || value;

  const fieldGridSize = hideEstado
    ? { xs: 12, sm: 6, md: 4 }
    : { xs: 12, sm: 6, md: 3 };

  const activeFilterCount = Object.entries(formik.values).filter(([key, value]) => {
    if (hideEstado && key === "estado") return false;
    return isFilterValueActive(value);
  }).length;
  const hasActiveFilters = activeFilterCount > 0;

  const razonesHelperText = (() => {
    if (razonesError) {
      return "No pudimos cargar las razones sociales. Intenta nuevamente.";
    }
    if (!loadingRazones && razonesSociales.length === 0 && currentRole?.empresaId) {
      return "No hay razones sociales disponibles.";
    }
    if (formik.touched.razonSocialReceptor && formik.errors.razonSocialReceptor) {
      return formik.errors.razonSocialReceptor as string;
    }
    return undefined;
  })();

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
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, borderTop: "1px solid var(--color-border-default-primary)" }} component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Folio */}
            <Grid size={fieldGridSize}>
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
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            {/* RUT Receptor */}
            <Grid size={fieldGridSize}>
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
                inputProps={{ maxLength: 20 }}
              />
            </Grid>

            {/* Razón Social Receptor */}
            <Grid size={fieldGridSize}>
              <Autocomplete
                multiple
                size="small"
                options={razonesSociales}
                value={formik.values.razonSocialReceptor}
                onChange={(_, newValue) => {
                  formik.setFieldValue("razonSocialReceptor", newValue);
                }}
                disabled={loadingRazones || (!razonesError && razonesSociales.length === 0)}
                disableCloseOnSelect
                loading={loadingRazones}
                noOptionsText={
                  razonesError
                    ? "No pudimos cargar las razones sociales."
                    : "No hay razones sociales disponibles."
                }
                sx={autocompleteFilterSx}
                renderTags={(value, getTagProps) => {
                  const visible = value.slice(0, 1);
                  const extra = value.length - visible.length;

                  return (
                    <>
                      {visible.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={key}
                            label={option}
                            size="small"
                            sx={{ ...chipSx, maxWidth: extra > 0 ? "70%" : "100%" }}
                            {...tagProps}
                          />
                        );
                      })}
                      {extra > 0 && (
                        <Chip label={`+${extra}`} size="small" sx={chipSx} />
                      )}
                    </>
                  );
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      key={key}
                      component="li"
                      {...optionProps}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: selected
                          ? "var(--color-bg-accent-secondary)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: selected
                            ? "var(--color-bg-accent-secondary-hover)"
                            : undefined,
                        },
                      }}
                    >
                      <span>{option}</span>
                      {selected && <Check fontSize="small" />}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="razonSocialReceptor"
                    label="Razón Social Receptor"
                    error={Boolean(razonesError) || (formik.touched.razonSocialReceptor && Boolean(formik.errors.razonSocialReceptor))}
                    helperText={razonesHelperText}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingRazones && <CircularProgress size={16} />}
                          {razonesError && !loadingRazones && currentRole?.empresaId && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchRazonesSociales(currentRole.empresaId!);
                              }}
                              aria-label="Reintentar carga de razones sociales"
                            >
                              <Refresh fontSize="small" />
                            </IconButton>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Estado */}
            {!hideEstado && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  multiple
                  size="small"
                  options={FACTURAS_STATES.map((estado) => estado.value)}
                  getOptionLabel={getEstadoLabel}
                  value={formik.values.estado}
                  onChange={(_, newValue) => {
                    formik.setFieldValue("estado", newValue);
                  }}
                  disableCloseOnSelect
                  sx={autocompleteFilterSx}
                  renderTags={(value, getTagProps) => {
                    const visible = value.slice(0, 1);
                    const extra = value.length - visible.length;

                    return (
                      <>
                        {visible.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={key}
                              label={getEstadoLabel(option)}
                              size="small"
                              sx={{ ...chipSx, maxWidth: extra > 0 ? "70%" : "100%" }}
                              {...tagProps}
                            />
                          );
                        })}
                        {extra > 0 && (
                          <Chip label={`+${extra}`} size="small" sx={chipSx} />
                        )}
                      </>
                    );
                  }}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: selected
                            ? "var(--color-bg-accent-secondary)"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: selected
                              ? "var(--color-bg-accent-secondary-hover)"
                              : undefined,
                          },
                        }}
                      >
                        <span>{getEstadoLabel(option)}</span>
                        {selected && <Check fontSize="small" />}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="estado"
                      label="Estado"
                      error={formik.touched.estado && Boolean(formik.errors.estado)}
                      helperText={formik.touched.estado && formik.errors.estado}
                      onBlur={formik.handleBlur}
                      inputProps={{
                        ...params.inputProps,
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
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
              type="submit"
              startIcon={<Search />}
              disabled={loading || formik.isSubmitting || !formik.isValid || !hasActiveFilters}
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
