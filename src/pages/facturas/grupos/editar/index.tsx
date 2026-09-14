import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Check,
  CheckCircle,
  Description,
  ErrorOutline,
  InfoOutlined,
  RequestQuote,
  Save,
  Search,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../../components/Layout";
import SectionPanel from "../../../../components/SectionPanel";
import DocumentsRequiredModal from "../../../../components/Modals/DocumentsRequiredModal";
import FacturaDetalleDrawer from "../../../../components/Facturas/FacturaDetalleDrawer";
import { formatCurrency } from "../../../../components/Facturas/FacturaResumenCard";
import { useFacturas } from "../../../../hooks/useFacturas";
import { useFactoring } from "../../../../hooks/useFactoring";
import { useFacturaGrupos } from "../../../../hooks/useFacturaGrupos";
import useAuthStore from "../../../../store/authStore";
import type {
  Factura,
  FacturaGrupo,
  FacturaGrupoVisibilidad,
} from "../../../../types/factura";
import type { Factoring } from "../../../../types/factoring";
import { hasFacturaPdf } from "../../../../utils/facturaDocuments";
import {
  appContentSx,
  tableScrollSx,
  tableWideSx,
} from "../../../../theme/layoutStyles";

const MIN_GRUPO = 2;
const MAX_GRUPO = 5;
const MIN_PLAZO = 1;
const MAX_PLAZO = 180;
const NOMBRE_MAX = 100;
const FETCH_LIMIT = 100;

const normalizeGrupoEstado = (estado?: string) =>
  (estado || "").trim().toUpperCase();

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

const mergeFacturasById = (...lists: Factura[][]) => {
  const map = new Map<string, Factura>();
  lists.flat().forEach((factura) => {
    if (factura?.id) map.set(factura.id, factura);
  });
  return Array.from(map.values());
};

const extractFactoringIds = (
  grupo: FacturaGrupo,
  grupoFacturas: Factura[],
): string[] => {
  const fromVisibilidades: string[] = [];
  if (Array.isArray(grupo.visibilidades)) {
    for (const item of grupo.visibilidades) {
      if (!item) continue;
      if (typeof item === "string") {
        fromVisibilidades.push(item);
        continue;
      }
      if (typeof item === "object") {
        const row = item as Record<string, unknown>;
        if (typeof row.factoringId === "string") {
          fromVisibilidades.push(row.factoringId);
          continue;
        }
        const factoring = row.factoring as { id?: string } | undefined;
        if (factoring?.id) {
          fromVisibilidades.push(factoring.id);
          continue;
        }
        if (typeof row.id === "string" && (row.razonSocial || row.rut)) {
          fromVisibilidades.push(row.id);
        }
      }
    }
  }
  if (fromVisibilidades.length > 0) {
    return [...new Set(fromVisibilidades)];
  }
  const fromFacturas = grupoFacturas.flatMap(
    (factura) =>
      factura.visibilidadDetalle?.factorings
        ?.map((f) => f.id)
        .filter((id): id is string => Boolean(id)) ?? [],
  );
  return [...new Set(fromFacturas)];
};

const EditarGrupoCotizacion = () => {
  const { id: grupoId } = useParams();
  const navigate = useNavigate();
  const { currentRole } = useAuthStore();
  const { getFacturas, fetchXMLContent } = useFacturas();
  const { getAllFactorings, loading: loadingFactorings } = useFactoring();
  const {
    getFacturaGrupoById,
    getFacturaGrupoFacturas,
    updateFacturaGrupo,
  } = useFacturaGrupos();

  const [nombre, setNombre] = useState("");
  const [porcentajeFinanciamiento, setPorcentajeFinanciamiento] = useState(100);
  const [plazo, setPlazo] = useState(30);
  const [visibilidad, setVisibilidad] =
    useState<FacturaGrupoVisibilidad>("TODOS");
  const [selectedFactorings, setSelectedFactorings] = useState<string[]>([]);
  const [factorings, setFactorings] = useState<Factoring[]>([]);

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [folioInput, setFolioInput] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedMontos, setSelectedMontos] = useState<Record<string, number>>(
    {},
  );
  const [selectedPdfOk, setSelectedPdfOk] = useState<Record<string, boolean>>(
    {},
  );
  const [pdfFetchingIds, setPdfFetchingIds] = useState<Record<string, boolean>>(
    {},
  );
  const pdfFetchInFlightRef = useRef<Set<string>>(new Set());
  const [maxSnackbarOpen, setMaxSnackbarOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] =
    useState(false);
  const [detalleFacturaId, setDetalleFacturaId] = useState<string | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);

  const goToDetalle = (replace = false) => {
    if (!grupoId) {
      navigate("/facturas/grupos", { replace });
      return;
    }
    navigate(`/facturas/grupos/${grupoId}`, { replace });
  };

  const ensurePdfForFactura = useCallback(async (factura: Factura) => {
    if (hasFacturaPdf(factura)) {
      setSelectedPdfOk((prev) => ({ ...prev, [factura.id]: true }));
      return;
    }
    if (pdfFetchInFlightRef.current.has(factura.id)) return;

    pdfFetchInFlightRef.current.add(factura.id);
    setPdfFetchingIds((prev) => ({ ...prev, [factura.id]: true }));
    setSelectedPdfOk((prev) => ({ ...prev, [factura.id]: false }));

    try {
      const fetched = await fetchXMLContent(factura.id);
      const ok = hasFacturaPdf(fetched);
      setFacturas((prev) =>
        prev.map((row) =>
          row.id === factura.id ? { ...row, ...fetched } : row,
        ),
      );
      setSelectedPdfOk((prev) => ({ ...prev, [factura.id]: ok }));
    } catch (err) {
      console.error("Error fetching PDF for factura:", factura.id, err);
      setSelectedPdfOk((prev) => ({ ...prev, [factura.id]: false }));
    } finally {
      pdfFetchInFlightRef.current.delete(factura.id);
      setPdfFetchingIds((prev) => {
        const next = { ...prev };
        delete next[factura.id];
        return next;
      });
    }
    // fetchXMLContent is recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPage = useCallback(async () => {
    if (!grupoId || !currentRole?.empresaId) {
      setLoadingPage(false);
      setLoadError("No se encontró el grupo.");
      return;
    }
    setLoadingPage(true);
    setLoadError(null);
    try {
      const [grupoData, grupoFacturas, cargadasRes] = await Promise.all([
        getFacturaGrupoById(grupoId),
        getFacturaGrupoFacturas(grupoId),
        getFacturas({
          page: 1,
          limit: FETCH_LIMIT,
          empresaId: currentRole.empresaId,
          estado: "CARGADA",
        }),
      ]);

      const estado = normalizeGrupoEstado(grupoData.estado);
      if (estado === "EN_MARKETPLACE" || estado === "CON_OFERTAS") {
        navigate(`/facturas/grupos/${grupoId}`, {
          replace: true,
          state: {
            editBlockedMessage:
              "Solo puedes editar un grupo cuando no está en el marketplace.",
          },
        });
        return;
      }

      const grupoFacturasList = grupoFacturas || [];
      const cargadas = cargadasRes?.data || [];
      const pool = mergeFacturasById(cargadas, grupoFacturasList);

      const selected = grupoFacturasList.map((f) => f.id);
      const montos: Record<string, number> = {};
      const pdfOk: Record<string, boolean> = {};
      const needFetch: Factura[] = [];

      grupoFacturasList.forEach((factura) => {
        montos[factura.id] = toMonto(factura.montoTotal);
        const ok = hasFacturaPdf(factura);
        pdfOk[factura.id] = ok;
        if (!ok) needFetch.push(factura);
      });

      const vis =
        (grupoData.visibilidad as FacturaGrupoVisibilidad) === "SELECCIONADOS"
          ? "SELECCIONADOS"
          : "TODOS";
      const factoringIds =
        vis === "SELECCIONADOS"
          ? extractFactoringIds(grupoData, grupoFacturasList)
          : [];

      setNombre(grupoData.nombre || "");
      setPorcentajeFinanciamiento(
        Number(grupoData.porcentajeFinanciamiento) || 100,
      );
      setPlazo(Number(grupoData.plazo) || 30);
      setVisibilidad(vis);
      setSelectedFactorings(factoringIds);
      setFacturas(pool);
      setSelectedIds(selected);
      setSelectedMontos(montos);
      setSelectedPdfOk(pdfOk);

      needFetch.forEach((factura) => {
        void ensurePdfForFactura(factura);
      });
    } catch (err) {
      console.error("Error loading factura grupo for edit:", err);
      setLoadError("No se pudo cargar el grupo. Intente nuevamente.");
      setFacturas([]);
    } finally {
      setLoadingPage(false);
    }
    // hook methods recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupoId, currentRole?.empresaId, navigate, ensurePdfForFactura]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

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
    setSelectedPdfOk((prev) => {
      const next = { ...prev };
      let changed = false;
      facturas.forEach((factura) => {
        if (!selectedIds.includes(factura.id)) return;
        if (pdfFetchInFlightRef.current.has(factura.id)) return;
        const ok = hasFacturaPdf(factura);
        if (next[factura.id] !== ok) {
          next[factura.id] = ok;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [facturas, selectedIds]);

  const clearSelectionForIds = (ids: string[]) => {
    const idSet = new Set(ids);
    setSelectedIds((prev) => prev.filter((id) => !idSet.has(id)));
    setSelectedMontos((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setSelectedPdfOk((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        delete next[id];
      });
      return next;
    });
  };

  const canSelectForGrupo = (factura: Factura) => {
    if (factura.estado?.toLowerCase() !== "cargada") return false;
    if (!factura.facturaGrupoId) return true;
    return factura.facturaGrupoId === grupoId;
  };

  const folioFilter = folioInput.trim().toLowerCase();
  const facturasDisponibles = facturas.filter(
    (factura) =>
      !factura.facturaGrupoId ||
      factura.facturaGrupoId === grupoId ||
      selectedIds.includes(factura.id),
  );
  const facturasFiltradas = folioFilter
    ? facturasDisponibles.filter((factura) =>
        String(factura.folio ?? "")
          .toLowerCase()
          .includes(folioFilter),
      )
    : facturasDisponibles;

  const selectableFacturas = facturasFiltradas.filter(canSelectForGrupo);
  const allSelectableSelected =
    selectableFacturas.length > 0 &&
    selectableFacturas.every((factura) => selectedIds.includes(factura.id));
  const someSelectableSelected =
    selectableFacturas.some((factura) => selectedIds.includes(factura.id)) &&
    !allSelectableSelected;

  const handleToggleSelectFactura = (factura: Factura) => {
    if (!canSelectForGrupo(factura)) return;
    if (selectedIds.includes(factura.id)) {
      clearSelectionForIds([factura.id]);
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
    setSelectedPdfOk((prev) => ({
      ...prev,
      [factura.id]: hasFacturaPdf(factura),
    }));
    void ensurePdfForFactura(factura);
  };

  const handleToggleSelectAll = () => {
    if (allSelectableSelected) {
      clearSelectionForIds(selectableFacturas.map((factura) => factura.id));
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
    setSelectedPdfOk((prev) => {
      const next = { ...prev };
      toAdd.forEach((factura) => {
        next[factura.id] = hasFacturaPdf(factura);
      });
      return next;
    });
    toAdd.forEach((factura) => {
      void ensurePdfForFactura(factura);
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
    if (selectedIds.some((id) => pdfFetchingIds[id])) {
      return "Esperá a que se obtengan los PDFs de las facturas seleccionadas";
    }
    if (selectedIds.some((id) => selectedPdfOk[id] !== true)) {
      return "Todas las facturas seleccionadas deben tener PDF";
    }
    if (porcentajeFinanciamiento < 1 || porcentajeFinanciamiento > 100) {
      return "El porcentaje a financiar debe estar entre 1% y 100%";
    }
    if (plazo === 0) return "El plazo es obligatorio";
    if (plazo < MIN_PLAZO || plazo > MAX_PLAZO) {
      return `El plazo debe estar entre ${MIN_PLAZO} y ${MAX_PLAZO} días`;
    }
    if (visibilidad === "SELECCIONADOS" && selectedFactorings.length === 0) {
      return "Debe seleccionar al menos un Factoring";
    }
    return null;
  };

  const handleGuardar = async () => {
    if (!currentRole || currentRole.nivel < 3) {
      setDocumentsRequiredModalOpen(true);
      return;
    }
    if (!grupoId || saving) return;

    const validationError = getValidationError();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    const trimmedNombre = nombre.trim();
    const allFactoringsSelected =
      visibilidad === "SELECCIONADOS" &&
      factorings.length > 0 &&
      factorings.every((factoring) =>
        selectedFactorings.includes(factoring.id!),
      );
    const payloadVisibilidad =
      visibilidad === "TODOS" || allFactoringsSelected
        ? "TODOS"
        : "SELECCIONADOS";

    try {
      setSaving(true);
      setSubmitError(null);
      await updateFacturaGrupo(grupoId, {
        nombre: trimmedNombre,
        porcentajeFinanciamiento,
        plazo,
        visibilidad: payloadVisibilidad,
        facturaIds: selectedIds,
        ...(payloadVisibilidad === "SELECCIONADOS"
          ? { factoringIds: selectedFactorings }
          : {}),
      });
      goToDetalle(true);
    } catch (err) {
      console.error("Error updating factura grupo:", err);
      setSubmitError("Error al actualizar el grupo. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (saving) return;
    goToDetalle();
  };

  if (loadingPage) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      </Layout>
    );
  }

  if (loadError) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/facturas/grupos")}
            sx={{
              mb: 2,
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
            }}
          >
            Volver a grupos
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
              gap: 2,
            }}
          >
            <ErrorOutline
              sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)" }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {loadError}
            </Typography>
            <Button
              variant="contained"
              onClick={() => void loadPage()}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "var(--color-fg-on-accent-primary)",
              }}
            >
              Reintentar
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

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
              "&:hover": {
                backgroundColor: "var(--color-bg-default-tertiary)",
              },
            }}
          >
            Volver al detalle
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              mb: 0.5,
            }}
          >
            Editar Grupo de Cotización
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Actualiza las facturas del grupo y los términos de la cotización.
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
              />
            </SectionPanel>

            <SectionPanel
              title="Seleccionar facturas"
              subtitle={`${facturasDisponibles.length} facturas disponibles (CARGADA, sin otro grupo)`}
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
                        <Search
                          sx={{ color: "var(--color-fg-default-tertiary)" }}
                        />
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

              {facturasFiltradas.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Description
                    sx={{
                      fontSize: 48,
                      color: "var(--color-fg-default-tertiary)",
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    {folioFilter
                      ? "No se encontraron facturas con ese folio"
                      : "No hay facturas CARGADA disponibles para agrupar"}
                  </Typography>
                </Box>
              ) : (
                <Box sx={tableScrollSx}>
                  <Table sx={tableWideSx} size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "var(--color-bg-default-tertiary)",
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ width: 48 }}>
                          <Checkbox
                            indeterminate={someSelectableSelected}
                            checked={allSelectableSelected}
                            disabled={selectableFacturas.length === 0}
                            onChange={handleToggleSelectAll}
                            inputProps={{
                              "aria-label":
                                "Seleccionar facturas de la página",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Folio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Receptor</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Fecha emisión
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Monto total
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>PDF</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {facturasFiltradas.map((factura) => {
                        const canSelect = canSelectForGrupo(factura);
                        const isSelected = selectedIds.includes(factura.id);
                        const isFetchingPdf = Boolean(
                          pdfFetchingIds[factura.id],
                        );
                        const hasPdf = isSelected
                          ? selectedPdfOk[factura.id] === true
                          : hasFacturaPdf(factura);
                        return (
                          <TableRow key={factura.id} selected={isSelected}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                disabled={!canSelect}
                                onChange={() =>
                                  handleToggleSelectFactura(factura)
                                }
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
                                sx={{
                                  color: "var(--color-fg-default-secondary)",
                                }}
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
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {formatCurrency(factura.montoTotal)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {isFetchingPdf ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <CircularProgress
                                    size={16}
                                    sx={{
                                      color: "var(--color-fg-accent-primary)",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "var(--color-fg-accent-primary)",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Obteniendo...
                                  </Typography>
                                </Box>
                              ) : hasPdf ? (
                                <Chip
                                  icon={<CheckCircle />}
                                  label="Obtenido"
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      "var(--color-bg-success-secondary)",
                                    color: "var(--color-fg-success-primary)",
                                    fontWeight: 500,
                                    "& .MuiChip-icon": {
                                      color: "var(--color-fg-success-primary)",
                                    },
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.75,
                                  }}
                                >
                                  <Description
                                    sx={{
                                      fontSize: 18,
                                      color: "var(--color-fg-default-tertiary)",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "var(--color-fg-default-tertiary)",
                                    }}
                                  >
                                    No disponible
                                  </Typography>
                                </Box>
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Ver detalle">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDetalleFacturaId(factura.id);
                                    setDetalleOpen(true);
                                  }}
                                  sx={{
                                    color: "var(--color-fg-default-secondary)",
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
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
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
              >
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
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
              >
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
                  sx={{
                    fontWeight: 700,
                    color: "var(--color-fg-success-primary)",
                  }}
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
                  sx={{
                    color: "var(--color-fg-success-primary)",
                    fontWeight: 600,
                  }}
                >
                  Monto a financiar aprox.: {formatCurrency(montoAFinanciar)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-fg-default-tertiary)" }}
                >
                  Monto total estimado:{" "}
                  {formatCurrency(montoTotalSeleccionado)}
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
                error={plazo < MIN_PLAZO || plazo > MAX_PLAZO}
                helperText={
                  plazo === 0
                    ? "El plazo es obligatorio"
                    : plazo > MAX_PLAZO
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
                          "&.Mui-checked": {
                            color: "var(--color-fg-accent-primary)",
                          },
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
                          "&.Mui-checked": {
                            color: "var(--color-fg-accent-primary)",
                          },
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
                          const factoring = factorings.find(
                            (f) => f.id === value,
                          );
                          return (
                            <Chip
                              key={value}
                              label={factoring?.razonSocial || value}
                              size="small"
                              sx={{
                                backgroundColor:
                                  "var(--color-bg-accent-secondary)",
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
                      const isSelected = selectedFactorings.includes(
                        factoring.id!,
                      );
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
            disabled={saving}
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
            startIcon={saving ? undefined : <Save />}
            onClick={() => {
              void handleGuardar();
            }}
            disabled={Boolean(getValidationError()) || saving}
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
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </Box>
      </Box>

      <Backdrop
        open={saving}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          color: "var(--color-fg-on-accent-primary)",
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(6px)",
          flexDirection: "column",
          gap: 2,
          px: 3,
        }}
      >
        <CircularProgress color="inherit" />
        <Typography
          variant="body1"
          sx={{
            maxWidth: 420,
            textAlign: "center",
            fontWeight: 600,
            color: "var(--color-fg-on-accent-primary)",
          }}
        >
          Guardando cambios del grupo…
        </Typography>
      </Backdrop>

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

      <FacturaDetalleDrawer
        open={detalleOpen}
        onClose={() => {
          setDetalleOpen(false);
          setDetalleFacturaId(null);
        }}
        facturaId={detalleFacturaId}
        onDeleted={() => {
          const deletedId = detalleFacturaId;
          setDetalleOpen(false);
          setDetalleFacturaId(null);
          if (deletedId) {
            clearSelectionForIds([deletedId]);
          }
          void loadPage();
        }}
        onFacturaUpdated={() => {
          void loadPage();
        }}
      />
    </Layout>
  );
};

export default EditarGrupoCotizacion;
