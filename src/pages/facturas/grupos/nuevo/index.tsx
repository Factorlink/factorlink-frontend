import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Check,
  CheckCircle,
  Description,
  InfoOutlined,
  RequestQuote,
  Search,
  Send,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../../components/Layout";
import SectionPanel from "../../../../components/SectionPanel";
import DocumentsRequiredModal from "../../../../components/Modals/DocumentsRequiredModal";
import { formatCurrency } from "../../../../components/Facturas/FacturaResumenCard";
import { useFacturas } from "../../../../hooks/useFacturas";
import { useFactoring } from "../../../../hooks/useFactoring";
import { useFacturaGrupos } from "../../../../hooks/useFacturaGrupos";
import useAuthStore from "../../../../store/authStore";
import type { Factura, FacturaGrupoVisibilidad } from "../../../../types/factura";
import type { Factoring } from "../../../../types/factoring";
import type { Meta } from "../../../../types/meta";
import { hasFacturaPdf } from "../../../../utils/facturaDocuments";
import {
  appContentSx,
  paginationSelectSx,
  tableScrollSx,
  tableWideSx,
  toolbarRowSx,
} from "../../../../theme/layoutStyles";

type NuevoGrupoLocationState = {
  facturaIds?: string[];
};

const MIN_GRUPO = 2;
const MAX_GRUPO = 5;
const MIN_PLAZO = 1;
const MAX_PLAZO = 180;
const NOMBRE_MAX = 100;
const DESCRIPCION_MAX = 200;
const SEARCH_DEBOUNCE_MS = 400;
const PAGE_LIMIT = 10;

const createDefaultGrupoNombre = () => {
  const fecha = new Date().toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `Grupo ${fecha}`;
};

const toMonto = (value: string | number) => {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(n) ? n : 0;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const NuevoGrupoCotizacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole } = useAuthStore();
  const { getFacturas, getFacturaById } = useFacturas();
  const { getAllFactorings, loading: loadingFactorings } = useFactoring();
  const { createFacturaGrupo } = useFacturaGrupos();

  const initialIds = (
    (location.state as NuevoGrupoLocationState | null)?.facturaIds ?? []
  ).slice(0, MAX_GRUPO);

  const [nombre, setNombre] = useState(createDefaultGrupoNombre);
  const [descripcion, setDescripcion] = useState("");
  const [porcentajeFinanciamiento, setPorcentajeFinanciamiento] = useState(100);
  const [plazo, setPlazo] = useState(30);
  const [visibilidad, setVisibilidad] =
    useState<FacturaGrupoVisibilidad>("TODOS");
  const [selectedFactorings, setSelectedFactorings] = useState<string[]>([]);
  const [factorings, setFactorings] = useState<Factoring[]>([]);

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: PAGE_LIMIT,
    page: 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
    totalGeneral: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [folioInput, setFolioInput] = useState("");
  const [folioSearch, setFolioSearch] = useState("");
  const [loadingFacturas, setLoadingFacturas] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [selectedMontos, setSelectedMontos] = useState<Record<string, number>>(
    {},
  );
  const [maxSnackbarOpen, setMaxSnackbarOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] =
    useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = folioInput.trim();
      if (next === folioSearch) return;
      setFolioSearch(next);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [folioInput, folioSearch]);

  const fetchCargadas = useCallback(async () => {
    if (!currentRole?.empresaId) {
      setLoadingFacturas(false);
      return;
    }
    setLoadingFacturas(true);
    setLoadError(null);
    try {
      const { data, meta: metaResponse } = await getFacturas({
        page,
        limit,
        empresaId: currentRole.empresaId,
        estado: "CARGADA",
        ...(folioSearch ? { folio: folioSearch } : {}),
      });
      setFacturas(data || []);
      if (metaResponse) {
        setMeta(metaResponse);
      }
    } catch (err) {
      console.error("Error fetching facturas CARGADA:", err);
      setLoadError("No se pudieron cargar las facturas. Intente nuevamente.");
      setFacturas([]);
    } finally {
      setLoadingFacturas(false);
    }
    // getFacturas is recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole?.empresaId, page, limit, folioSearch]);

  useEffect(() => {
    void fetchCargadas();
  }, [fetchCargadas]);

  useEffect(() => {
    const loadFactorings = async () => {
      try {
        const data = await getAllFactorings();
        setFactorings(data || []);
      } catch (err) {
        console.error("Error fetching factorings:", err);
      }
    };
    void loadFactorings();
    // getAllFactorings is recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedMontos((prev) => {
      const next = { ...prev };
      let changed = false;
      facturas.forEach((factura) => {
        if (selectedIds.includes(factura.id) && next[factura.id] == null) {
          next[factura.id] = toMonto(factura.montoTotal);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [facturas, selectedIds]);

  useEffect(() => {
    if (initialIds.length === 0) return;
    let cancelled = false;
    const ids = initialIds;
    const hydrate = async () => {
      const results = await Promise.all(
        ids.map((id) => getFacturaById(id).catch(() => null)),
      );
      if (cancelled) return;
      const montos: Record<string, number> = {};
      const validIds: string[] = [];
      results.forEach((factura, index) => {
        const id = ids[index];
        if (!factura) {
          validIds.push(id);
          return;
        }
        if (
          factura.estado?.toLowerCase() !== "cargada" ||
          factura.facturaGrupoId
        ) {
          return;
        }
        validIds.push(id);
        montos[id] = toMonto(factura.montoTotal);
      });
      setSelectedIds(validIds);
      setSelectedMontos((prev) => ({ ...montos, ...prev }));
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
    // Hydrate preselected ids once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSelectForGrupo = (factura: Factura) =>
    factura.estado?.toLowerCase() === "cargada" && !factura.facturaGrupoId;

  const selectableFacturas = facturas.filter(canSelectForGrupo);
  const allSelectableSelected =
    selectableFacturas.length > 0 &&
    selectableFacturas.every((factura) => selectedIds.includes(factura.id));
  const someSelectableSelected =
    selectableFacturas.some((factura) => selectedIds.includes(factura.id)) &&
    !allSelectableSelected;

  const handleToggleSelectFactura = (factura: Factura) => {
    if (!canSelectForGrupo(factura)) return;
    if (selectedIds.includes(factura.id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== factura.id));
      setSelectedMontos((prev) => {
        const next = { ...prev };
        delete next[factura.id];
        return next;
      });
      return;
    }
    if (selectedIds.length >= MAX_GRUPO) {
      setMaxSnackbarOpen(true);
      return;
    }
    setSelectedIds((prev) => [...prev, factura.id]);
    setSelectedMontos((prev) => ({
      ...prev,
      [factura.id]: toMonto(factura.montoTotal),
    }));
  };

  const handleToggleSelectAll = () => {
    if (allSelectableSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !selectableFacturas.some((factura) => factura.id === id)),
      );
      setSelectedMontos((prev) => {
        const next = { ...prev };
        selectableFacturas.forEach((factura) => {
          delete next[factura.id];
        });
        return next;
      });
      return;
    }
    const remaining = MAX_GRUPO - selectedIds.length;
    if (remaining <= 0) {
      setMaxSnackbarOpen(true);
      return;
    }
    const toAdd = selectableFacturas
      .filter((factura) => !selectedIds.includes(factura.id))
      .slice(0, remaining);
    if (
      toAdd.length <
      selectableFacturas.filter((factura) => !selectedIds.includes(factura.id))
        .length
    ) {
      setMaxSnackbarOpen(true);
    }
    setSelectedIds((prev) => [...prev, ...toAdd.map((factura) => factura.id)]);
    setSelectedMontos((prev) => {
      const next = { ...prev };
      toAdd.forEach((factura) => {
        next[factura.id] = toMonto(factura.montoTotal);
      });
      return next;
    });
  };

  const montoTotalSeleccionado = selectedIds.reduce(
    (sum, id) => sum + (selectedMontos[id] ?? 0),
    0,
  );
  const montoAFinanciar = Math.trunc(
    (montoTotalSeleccionado * porcentajeFinanciamiento) / 100,
  );

  const getValidationError = () => {
    const trimmedNombre = nombre.trim();
    if (!trimmedNombre) return "El nombre del grupo es obligatorio";
    if (selectedIds.length < MIN_GRUPO || selectedIds.length > MAX_GRUPO) {
      return `Debes seleccionar entre ${MIN_GRUPO} y ${MAX_GRUPO} facturas`;
    }
    if (porcentajeFinanciamiento < 1 || porcentajeFinanciamiento > 100) {
      return "El porcentaje a financiar debe estar entre 1% y 100%";
    }
    if (plazo < MIN_PLAZO || plazo > MAX_PLAZO) {
      return `El plazo debe estar entre ${MIN_PLAZO} y ${MAX_PLAZO} días`;
    }
    if (visibilidad === "SELECCIONADOS" && selectedFactorings.length === 0) {
      return "Debe seleccionar al menos un Factoring";
    }
    return null;
  };

  const handleEnviarACotizar = async () => {
    if (!currentRole || currentRole.nivel < 3) {
      setDocumentsRequiredModalOpen(true);
      return;
    }
    const validationError = getValidationError();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    if (!currentRole.empresaId) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const created = await createFacturaGrupo({
        empresaId: currentRole.empresaId,
        nombre: nombre.trim(),
        porcentajeFinanciamiento,
        plazo,
        visibilidad,
        factoringIds: visibilidad === "TODOS" ? [] : selectedFactorings,
        facturaIds: selectedIds,
      });
      if (!created?.id) {
        setSubmitError("El grupo se creó pero no se recibió el identificador.");
        return;
      }
      navigate(`/facturas/grupos/${created.id}`, { replace: true });
    } catch (err) {
      console.error("Error creating factura grupo:", err);
      setSubmitError("Error al enviar a cotizar. Intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate("/facturas");

  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
              "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
            }}
          >
            Volver a facturas
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)", mb: 0.5 }}
          >
            Crear Grupo de Cotización
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Selecciona las facturas que deseas incluir en el grupo y configura los
            términos de la cotización.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <SectionPanel title="Información del grupo">
              <TextField
                label="Nombre del grupo"
                required
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value.slice(0, NOMBRE_MAX))}
                helperText={`${nombre.length}/${NOMBRE_MAX}`}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Descripción (opcional)"
                fullWidth
                multiline
                minRows={3}
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value.slice(0, DESCRIPCION_MAX))
                }
                helperText={`${descripcion.length}/${DESCRIPCION_MAX}`}
              />
            </SectionPanel>

            <SectionPanel
              title="Seleccionar facturas"
              subtitle={`${meta.total} facturas disponibles (solo facturas en estado CARGADA)`}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Buscar por folio..."
                  value={folioInput}
                  onChange={(e) => setFolioInput(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "var(--color-fg-default-tertiary)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1, minWidth: 220 }}
                />
                <Chip
                  label={`${selectedIds.length} seleccionadas`}
                  sx={{
                    backgroundColor: "var(--color-bg-accent-secondary)",
                    color: "var(--color-fg-accent-primary)",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {loadError ? (
                <Alert severity="error">{loadError}</Alert>
              ) : loadingFacturas ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : facturas.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Description
                    sx={{ fontSize: 48, color: "var(--color-fg-default-tertiary)", mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    {folioSearch
                      ? "No se encontraron facturas con ese folio"
                      : "No hay facturas en estado CARGADA"}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={tableScrollSx}>
                    <Table sx={tableWideSx} size="small">
                      <TableHead>
                        <TableRow
                          sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}
                        >
                          <TableCell padding="checkbox" sx={{ width: 48 }}>
                            <Checkbox
                              indeterminate={someSelectableSelected}
                              checked={allSelectableSelected}
                              disabled={selectableFacturas.length === 0}
                              onChange={handleToggleSelectAll}
                              inputProps={{
                                "aria-label": "Seleccionar facturas de la página",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Folio</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Receptor</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Fecha emisión</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Monto total</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>PDF</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {facturas.map((factura) => {
                          const canSelect = canSelectForGrupo(factura);
                          const isSelected = selectedIds.includes(factura.id);
                          const hasPdf = hasFacturaPdf(factura);
                          return (
                            <TableRow key={factura.id} selected={isSelected}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  disabled={!canSelect}
                                  onChange={() => handleToggleSelectFactura(factura)}
                                  inputProps={{
                                    "aria-label": `Seleccionar factura ${factura.folio}`,
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "var(--color-fg-accent-primary)",
                                    fontWeight: 600,
                                  }}
                                >
                                  #{factura.folio}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "var(--color-fg-default-primary)",
                                  }}
                                >
                                  {factura.razonSocialReceptor || "N/A"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "var(--color-fg-default-secondary)" }}
                                >
                                  {factura.rutReceptor || ""}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {formatDate(factura.fechaEmision)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {formatCurrency(factura.montoTotal)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {hasPdf ? (
                                  <Chip
                                    icon={<CheckCircle />}
                                    label="Obtenido"
                                    size="small"
                                    sx={{
                                      backgroundColor: "var(--color-bg-success-secondary)",
                                      color: "var(--color-fg-success-primary)",
                                      fontWeight: 500,
                                      "& .MuiChip-icon": {
                                        color: "var(--color-fg-success-primary)",
                                      },
                                    }}
                                  />
                                ) : (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "var(--color-fg-default-tertiary)" }}
                                  >
                                    No disponible
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    window.open(
                                      `/facturas/${factura.id}`,
                                      "_blank",
                                      "noopener,noreferrer",
                                    )
                                  }
                                  sx={{ textTransform: "none", fontWeight: 600 }}
                                >
                                  Ver detalle
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                  <Box
                    sx={[
                      toolbarRowSx,
                      { borderTop: "1px solid var(--color-border-default-primary)" },
                    ]}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--color-fg-default-secondary)" }}
                    >
                      Mostrando {from} a {to} de {meta.total} facturas
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <FormControl size="small" sx={paginationSelectSx}>
                        <InputLabel id="grupo-limit-label">Filas por página</InputLabel>
                        <Select
                          labelId="grupo-limit-label"
                          value={String(limit)}
                          label="Filas por página"
                          onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                          }}
                        >
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                      {meta.lastPage > 1 && (
                        <Pagination
                          count={meta.lastPage}
                          page={page}
                          onChange={(_e, value) => setPage(value)}
                          color="primary"
                          shape="rounded"
                          sx={{
                            "& .MuiPaginationItem-root.Mui-selected": {
                              color: "var(--color-fg-on-accent-primary)",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </SectionPanel>
          </Box>

          <Box
            sx={{
              position: { lg: "sticky" },
              top: { lg: 16 },
            }}
          >
            <SectionPanel title="Resumen del grupo">
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Facturas seleccionadas
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedIds.length}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Monto total
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(montoTotalSeleccionado)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Monto a financiar aprox.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "var(--color-fg-success-primary)" }}
                >
                  {formatCurrency(montoAFinanciar)}
                </Typography>
              </Box>
            </SectionPanel>

            <SectionPanel
              title="Términos de financiamiento"
              icon={
                <RequestQuote
                  sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
                />
              }
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--color-fg-default-secondary)", mb: 1 }}
              >
                Porcentaje a financiar: {porcentajeFinanciamiento}%
              </Typography>
              <Slider
                value={porcentajeFinanciamiento}
                onChange={(_e, value) =>
                  setPorcentajeFinanciamiento(value as number)
                }
                min={1}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{
                  color: "var(--color-fg-accent-primary)",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "var(--color-bg-accent-primary)",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "var(--color-bg-accent-primary)",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-fg-success-primary)", fontWeight: 600 }}
                >
                  Monto a financiar aprox.: {formatCurrency(montoAFinanciar)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-fg-default-tertiary)" }}
                >
                  Monto total estimado: {formatCurrency(montoTotalSeleccionado)}
                </Typography>
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--color-fg-default-secondary)", mb: 1 }}
              >
                Plazo de pago (días)
              </Typography>
              <TextField
                value={plazo === 0 ? "" : plazo}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  if (onlyNums.startsWith("0") || onlyNums.length > 3) return;
                  setPlazo(onlyNums === "" ? 0 : Number(onlyNums));
                }}
                fullWidth
                size="small"
                error={plazo > MAX_PLAZO}
                helperText={
                  plazo > MAX_PLAZO
                    ? "El plazo máximo es de 180 días"
                    : `Mínimo ${MIN_PLAZO} día, máximo ${MAX_PLAZO} días`
                }
              />
            </SectionPanel>

            <SectionPanel
              title="Visibilidad en Marketplace"
              subtitle="¿Quién puede ver este grupo?"
              icon={
                <Visibility
                  sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
                />
              }
            >
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ color: "var(--color-fg-default-secondary)", mb: 1 }}
                >
                  ¿Quién puede ver este grupo?
                </FormLabel>
                <RadioGroup
                  value={visibilidad}
                  onChange={(e) =>
                    setVisibilidad(e.target.value as FacturaGrupoVisibilidad)
                  }
                >
                  <FormControlLabel
                    value="TODOS"
                    control={
                      <Radio
                        sx={{
                          color: "var(--color-fg-default-secondary)",
                          "&.Mui-checked": { color: "var(--color-fg-accent-primary)" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Todos los Factorings
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--color-fg-default-secondary)" }}
                        >
                          Visible para todos los factorings activos
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="SELECCIONADOS"
                    control={
                      <Radio
                        sx={{
                          color: "var(--color-fg-default-secondary)",
                          "&.Mui-checked": { color: "var(--color-fg-accent-primary)" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Solo Factorings seleccionados
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--color-fg-default-secondary)" }}
                        >
                          Seleccionar factorings específicos
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {visibilidad === "SELECCIONADOS" && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Seleccionar Factorings</InputLabel>
                  <Select
                    multiple
                    value={selectedFactorings}
                    onChange={(e) =>
                      setSelectedFactorings(e.target.value as string[])
                    }
                    label="Seleccionar Factorings"
                    disabled={loadingFactorings}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const factoring = factorings.find((f) => f.id === value);
                          return (
                            <Chip
                              key={value}
                              label={factoring?.razonSocial || value}
                              size="small"
                              sx={{
                                backgroundColor: "var(--color-bg-accent-secondary)",
                                color: "var(--color-fg-accent-primary)",
                                fontWeight: 500,
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {factorings.map((factoring) => {
                      const isSelected = selectedFactorings.includes(factoring.id!);
                      return (
                        <MenuItem
                          key={factoring.id}
                          value={factoring.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: isSelected
                              ? "var(--color-bg-accent-secondary)"
                              : "transparent",
                          }}
                        >
                          <span>
                            {factoring.razonSocial} - {factoring.rut}
                          </span>
                          {isSelected && (
                            <Check
                              sx={{
                                color: "var(--color-fg-accent-primary)",
                                ml: 1,
                                fontSize: 20,
                              }}
                            />
                          )}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            </SectionPanel>

            <Alert
              severity="info"
              icon={<InfoOutlined />}
              sx={{
                mb: 3,
                borderRadius: "var(--radius-m)",
              }}
            >
              Los PDFs se obtienen automáticamente desde tu servicio de Cuentas
              Internos.
            </Alert>
          </Box>
        </Box>

        {submitError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setSubmitError(null)}
          >
            {submitError}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              borderColor: "var(--color-fg-default-secondary)",
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              "&:hover": {
                borderColor: "var(--color-fg-default-primary)",
                backgroundColor: "var(--color-bg-default-tertiary)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={submitting ? undefined : <Send />}
            onClick={handleEnviarACotizar}
            disabled={Boolean(getValidationError()) || submitting}
            sx={{
              backgroundColor: "var(--color-bg-accent-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-accent-primary-hover)",
              },
              "&:disabled": {
                backgroundColor: "var(--color-bg-disabled-primary)",
              },
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              color: "var(--color-fg-on-accent-primary)",
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Enviar a cotizar"
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={maxSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setMaxSnackbarOpen(false)}
        message="Máximo 5 facturas por grupo"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <DocumentsRequiredModal
        open={documentsRequiredModalOpen}
        onClose={() => setDocumentsRequiredModalOpen(false)}
      />
    </Layout>
  );
};

export default NuevoGrupoCotizacion;
