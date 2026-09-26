import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  Description,
  ErrorOutline,
  InfoOutlined,
  Send,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../../../components/Layout";
import SectionPanel from "../../../../../components/SectionPanel";
import FacturaGrupoFactoringDetalleDrawer from "../../../../../components/Facturas/FacturaGrupoFactoringDetalleDrawer";
import FacturaGrupoOfertaGrupalDrawer from "../../../../../components/Facturas/FacturaGrupoOfertaGrupalDrawer";
import { formatCurrency } from "../../../../../components/Facturas/FacturaResumenCard";
import { useFacturaGrupos } from "../../../../../hooks/useFacturaGrupos";
import { useOfertas } from "../../../../../hooks/useOfertas";
import useAuthStore from "../../../../../store/authStore";
import type { Factura, FacturaGrupo } from "../../../../../types/factura";
import { getFacturaStatusConfig } from "../../../../../theme";
import {
  getFacturaGrupoMontoFinanciar,
  getFacturaGrupoMontoTotal,
  parseFacturaGrupoFactoringTab,
  type FacturaGrupoFactoringDrawerTab,
} from "../../../../../utils/facturaGrupo";
import {
  canEnviarOfertaAlGrupo,
  facturaPuedeSeleccionarseParaOfertaGrupal,
  facturaTieneOfertaEnviada,
  getBorradoresPendientesEnvio,
  getFacturaGrupoOfertaDisplay,
  type OfertaGrupoBorrador,
} from "../../../../../utils/facturaGrupoOferta";
import { buildCreateOfertaPayload } from "../../../../../utils/ofertaPayload";
import {
  appContentSx,
  tableScrollSx,
  tableShellSx,
  tableWideSx,
} from "../../../../../theme/layoutStyles";

type GrupoFactoringLocationState = {
  from?: string;
  nombre?: string;
};

const getMarketplaceBackPath = (from: unknown) => {
  if (typeof from === "string" && from.startsWith("/marketplace")) {
    return from;
  }
  return "/marketplace";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const headerCellSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-secondary)",
} as const;

const FacturaGrupoOfertaCell = ({
  factura,
  hasBorrador,
}: {
  factura: Factura;
  hasBorrador: boolean;
}) => {
  const display = getFacturaGrupoOfertaDisplay(factura, hasBorrador);

  if (display.kind === "sin_oferta") {
    return (
      <Typography
        variant="body2"
        sx={{ color: "var(--color-fg-default-tertiary)" }}
      >
        {display.label}
      </Typography>
    );
  }

  return (
    <Chip
      label={display.label}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor: "var(--color-bg-accent-secondary)",
        color: "var(--color-fg-accent-primary)",
      }}
    />
  );
};

const FacturaGrupoFactoringDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentRole } = useAuthStore();
  const { getFacturaGrupoById, getFacturaGrupoFacturasFactoring } =
    useFacturaGrupos();
  const { createOfertasGrupoFacturas, loading: sendingOfertas } = useOfertas();
  const factoringId = currentRole?.factoringId || "";

  const state = (location.state as GrupoFactoringLocationState | null) ?? null;
  const backPath = getMarketplaceBackPath(state?.from);

  const detalleFacturaId = searchParams.get("facturaId");
  const drawerOpen = Boolean(detalleFacturaId);
  const drawerTab =
    parseFacturaGrupoFactoringTab(searchParams.get("tab")) || "informacion";
  const ofertaIdParam = searchParams.get("ofertaId");

  const [grupo, setGrupo] = useState<FacturaGrupo | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [borradores, setBorradores] = useState<
    Record<string, OfertaGrupoBorrador>
  >({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendErrorReason, setSendErrorReason] = useState<string | null>(null);
  const [sendSuccessOpen, setSendSuccessOpen] = useState(false);
  const [individualSendErrorOpen, setIndividualSendErrorOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ofertaGrupalOpen, setOfertaGrupalOpen] = useState(false);
  const [grupalSendError, setGrupalSendError] = useState<string | null>(null);
  const [grupalSendErrorReason, setGrupalSendErrorReason] = useState<
    string | null
  >(null);

  const loadDetalle = useCallback(async () => {
    if (!id) {
      setLoadingPage(false);
      setLoadError("No se encontró el grupo.");
      return;
    }
    if (!factoringId) {
      setLoadingPage(false);
      setLoadError("No se encontró el factoring activo.");
      return;
    }
    setLoadingPage(true);
    setLoadError(null);
    try {
      const [grupoData, facturasData] = await Promise.all([
        getFacturaGrupoById(id, { factoringId }),
        getFacturaGrupoFacturasFactoring(id, factoringId),
      ]);
      setGrupo(grupoData);
      setFacturas(facturasData || []);
    } catch (err) {
      console.error("Error loading factura grupo factoring:", err);
      setGrupo(null);
      setFacturas([]);
      setLoadError("No se pudo cargar el grupo. Intente nuevamente.");
    } finally {
      setLoadingPage(false);
    }
    // hook methods are recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, factoringId]);

  useEffect(() => {
    void loadDetalle();
  }, [loadDetalle]);

  // Limpia borradores locales de facturas que ya tienen oferta enviada.
  useEffect(() => {
    setBorradores((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const factura of facturas) {
        if (facturaTieneOfertaEnviada(factura) && next[factura.id]) {
          delete next[factura.id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [facturas]);

  const handleBack = () => {
    navigate(backPath);
  };

  const setDrawerParams = (
    next: {
      facturaId?: string | null;
      tab?: FacturaGrupoFactoringDrawerTab | null;
      ofertaId?: string | null;
    },
    replace = true,
  ) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next.facturaId === null) {
          params.delete("facturaId");
          params.delete("tab");
          params.delete("ofertaId");
          return params;
        }
        if (next.facturaId !== undefined && next.facturaId) {
          params.set("facturaId", next.facturaId);
        }
        if (next.tab === null) {
          params.delete("tab");
        } else if (next.tab !== undefined) {
          if (next.tab === "informacion") params.delete("tab");
          else params.set("tab", next.tab);
        }
        if (next.ofertaId === null) {
          params.delete("ofertaId");
        } else if (next.ofertaId !== undefined) {
          if (next.ofertaId) params.set("ofertaId", next.ofertaId);
          else params.delete("ofertaId");
        }
        // ofertaId only meaningful on historial
        const tab = params.get("tab");
        if (tab !== "historial") params.delete("ofertaId");
        return params;
      },
      { replace },
    );
  };

  const handleVerDetalle = (factura: Factura) => {
    setDrawerParams({ facturaId: factura.id, tab: "informacion", ofertaId: null });
  };

  const handleCloseDrawer = () => {
    if (sendingOfertas) return;
    setDrawerParams({ facturaId: null });
  };

  const handleDrawerTabChange = (tab: FacturaGrupoFactoringDrawerTab) => {
    setDrawerParams({
      tab,
      ofertaId: tab === "historial" ? ofertaIdParam : null,
    });
  };

  const handleSaveBorrador = (borrador: OfertaGrupoBorrador) => {
    const factura = facturas.find((f) => f.id === borrador.facturaId);
    if (facturaTieneOfertaEnviada(factura)) return;
    setBorradores((prev) => ({
      ...prev,
      [borrador.facturaId]: borrador,
    }));
  };

  const handleDeleteBorrador = (facturaId: string) => {
    setBorradores((prev) => {
      const next = { ...prev };
      delete next[facturaId];
      return next;
    });
  };

  const handleEnviarOfertaAlGrupo = () => {
    if (!canEnviarOfertaAlGrupo(borradores, facturas) || !id) return;
    setSendError(null);
    setSendErrorReason(null);
    setSendConfirmOpen(true);
  };

  const handleConfirmEnviarOfertaAlGrupo = async () => {
    if (!id || !canEnviarOfertaAlGrupo(borradores, facturas)) return;
    try {
      setSendError(null);
      setSendErrorReason(null);
      const pendientes = getBorradoresPendientesEnvio(borradores, facturas);
      const ofertas = pendientes.map((borrador) =>
        buildCreateOfertaPayload(borrador),
      );
      await createOfertasGrupoFacturas({
        facturaGrupoId: id,
        ofertas,
      });
      setBorradores({});
      setSendConfirmOpen(false);
      setSendSuccessOpen(true);
      await loadDetalle();
    } catch (err) {
      console.error("Error sending ofertas grupo facturas:", err);
      const axiosError = err as {
        response?: { data?: { message?: string; reason?: string } };
      };
      setSendError(
        axiosError?.response?.data?.message ||
          "No se pudo enviar la oferta al grupo. Intente nuevamente.",
      );
      setSendErrorReason(axiosError?.response?.data?.reason || null);
    }
  };

  const selectableFacturas = useMemo(
    () =>
      facturas.filter((factura) =>
        facturaPuedeSeleccionarseParaOfertaGrupal(
          factura,
          Boolean(borradores[factura.id]),
        ),
      ),
    [facturas, borradores],
  );
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const facturasSeleccionadas = useMemo(
    () =>
      facturas.filter(
        (factura) =>
          selectedIdSet.has(factura.id) &&
          facturaPuedeSeleccionarseParaOfertaGrupal(
            factura,
            Boolean(borradores[factura.id]),
          ),
      ),
    [facturas, selectedIdSet, borradores],
  );
  const allSelectableSelected =
    selectableFacturas.length > 0 &&
    selectableFacturas.every((factura) => selectedIdSet.has(factura.id));
  const someSelectableSelected =
    selectableFacturas.some((factura) => selectedIdSet.has(factura.id)) &&
    !allSelectableSelected;

  useEffect(() => {
    const eligible = new Set(selectableFacturas.map((factura) => factura.id));
    setSelectedIds((prev) => {
      const next = prev.filter((id) => eligible.has(id));
      if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
        return prev;
      }
      return next;
    });
  }, [selectableFacturas]);

  const handleToggleSelectFactura = (factura: Factura) => {
    if (
      !facturaPuedeSeleccionarseParaOfertaGrupal(
        factura,
        Boolean(borradores[factura.id]),
      ) ||
      sendingOfertas
    ) {
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(factura.id)
        ? prev.filter((id) => id !== factura.id)
        : [...prev, factura.id],
    );
  };

  const handleToggleSelectAll = () => {
    if (sendingOfertas || selectableFacturas.length === 0) return;
    if (allSelectableSelected) {
      const selectableIdSet = new Set(
        selectableFacturas.map((factura) => factura.id),
      );
      setSelectedIds((prev) => prev.filter((id) => !selectableIdSet.has(id)));
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      selectableFacturas.forEach((factura) => next.add(factura.id));
      return Array.from(next);
    });
  };

  const handleOpenOfertaGrupal = () => {
    if (facturasSeleccionadas.length < 2 || sendingOfertas) return;
    setGrupalSendError(null);
    setGrupalSendErrorReason(null);
    setOfertaGrupalOpen(true);
  };

  const handleCloseOfertaGrupal = () => {
    if (sendingOfertas) return;
    setOfertaGrupalOpen(false);
  };

  const handleCrearOfertaGrupal = async (
    borradoresGrupales: OfertaGrupoBorrador[],
  ) => {
    if (!id || borradoresGrupales.length === 0) return;
    try {
      setGrupalSendError(null);
      setGrupalSendErrorReason(null);
      const ofertas = borradoresGrupales.map((borrador) =>
        buildCreateOfertaPayload(borrador),
      );
      await createOfertasGrupoFacturas({
        facturaGrupoId: id,
        ofertas,
      });
      const sentIds = new Set(
        borradoresGrupales.map((borrador) => borrador.facturaId),
      );
      setBorradores((prev) => {
        const next = { ...prev };
        sentIds.forEach((facturaId) => {
          delete next[facturaId];
        });
        return next;
      });
      setSelectedIds([]);
      setOfertaGrupalOpen(false);
      setSendSuccessOpen(true);
      await loadDetalle();
    } catch (err) {
      console.error("Error creating oferta grupal:", err);
      const axiosError = err as {
        response?: { data?: { message?: string; reason?: string } };
        message?: string;
      };
      setGrupalSendError(
        axiosError?.response?.data?.message ||
          (err instanceof Error ? err.message : null) ||
          "No se pudo crear la oferta grupal. Intente nuevamente.",
      );
      setGrupalSendErrorReason(axiosError?.response?.data?.reason || null);
    }
  };

  const handleEnviarOfertaIndividual = async (
    borrador: OfertaGrupoBorrador,
  ) => {
    if (!id) return;
    const factura = facturas.find((f) => f.id === borrador.facturaId);
    if (facturaTieneOfertaEnviada(factura)) return;

    try {
      setSendError(null);
      setSendErrorReason(null);
      const payload = buildCreateOfertaPayload(borrador);
      await createOfertasGrupoFacturas({
        facturaGrupoId: id,
        ofertas: [payload],
      });
      setBorradores((prev) => {
        const next = { ...prev };
        delete next[borrador.facturaId];
        return next;
      });
      handleCloseDrawer();
      setSendSuccessOpen(true);
      await loadDetalle();
    } catch (err) {
      console.error("Error sending oferta individual:", err);
      const axiosError = err as {
        response?: { data?: { message?: string; reason?: string } };
      };
      setSendError(
        axiosError?.response?.data?.message ||
          "No se pudo enviar la oferta individual. Intente nuevamente.",
      );
      setSendErrorReason(axiosError?.response?.data?.reason || null);
      setIndividualSendErrorOpen(true);
    }
  };

  const montoTotal = useMemo(() => {
    if (facturas.length > 0) {
      return facturas.reduce((sum, factura) => {
        const n =
          typeof factura.montoTotal === "string"
            ? parseFloat(factura.montoTotal)
            : Number(factura.montoTotal);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0);
    }
    return getFacturaGrupoMontoTotal(grupo);
  }, [facturas, grupo]);

  const montoFinanciar = getFacturaGrupoMontoFinanciar(grupo);
  const pendientesEnvio = useMemo(
    () => getBorradoresPendientesEnvio(borradores, facturas),
    [borradores, facturas],
  );
  const canSend = canEnviarOfertaAlGrupo(borradores, facturas);
  const borradoresCount = pendientesEnvio.length;
  const statusConfig = getFacturaStatusConfig(grupo?.estado || "");
  const tituloNombre =
    grupo?.nombre?.trim() || state?.nombre?.trim() || "Grupo de cotización";

  if (loadingPage) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (loadError || !grupo) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              mb: 2,
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
            }}
          >
            Volver al marketplace
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
              {loadError || "Grupo no encontrado"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => void loadDetalle()}
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
      <Box sx={{ ...appContentSx, pb: 12 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            mb: 2,
            color: "var(--color-fg-default-secondary)",
            textTransform: "none",
            "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
          }}
        >
          Volver al marketplace
        </Button>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
          >
            Detalle del grupo: {tituloNombre}
          </Typography>
          {grupo.estado && (
            <Chip
              icon={statusConfig.icon as ReactElement}
              label={statusConfig.label}
              size="small"
              sx={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 600,
                "& .MuiChip-icon": { color: statusConfig.color },
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "var(--color-fg-default-secondary)", mb: 3 }}
        >
          Revisa la información del grupo y las facturas asociadas. Puedes
          guardar borradores, enviar ofertas de forma individual o al grupo.
        </Typography>

        <SectionPanel
          title="Información del grupo"
          icon={
            <Description
              sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
            />
          }
        >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Nombre del grupo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {grupo.nombre || "—"}
                  </Typography>
                </Box>
                {Boolean(grupo.descripcion?.trim()) && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--color-fg-default-secondary)" }}
                    >
                      Descripción
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {grupo.descripcion}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  p: 2,
                  borderRadius: "var(--radius-m)",
                  backgroundColor: "var(--color-bg-default-tertiary)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Facturas en el grupo
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {facturas.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Monto total del grupo
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(montoTotal)}
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
                    {formatCurrency(montoFinanciar)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </SectionPanel>

          <SectionPanel
            title={`Facturas asociadas al grupo (${facturas.length})`}
            icon={
              <Description
                sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
              />
            }
            action={
              facturas.length > 0 ? (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  disabled={
                    facturasSeleccionadas.length < 2 || sendingOfertas
                  }
                  onClick={handleOpenOfertaGrupal}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--color-fg-on-accent-primary)",
                    backgroundColor: "var(--color-bg-accent-primary)",
                    "&:hover": {
                      backgroundColor: "var(--color-bg-accent-primary-hover)",
                    },
                    "&:disabled": {
                      backgroundColor: "var(--color-bg-disabled-primary)",
                      color: "var(--color-fg-disabled-primary)",
                    },
                  }}
                >
                  Crear oferta grupal
                </Button>
              ) : undefined
            }
          >
            {facturas.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Este grupo aún no tiene facturas asociadas.
              </Typography>
            ) : (
              <>
                <TableContainer sx={tableShellSx}>
                  <Box sx={tableScrollSx}>
                    <Table sx={tableWideSx}>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor:
                              "var(--color-bg-default-tertiary)",
                          }}
                        >
                          <TableCell padding="checkbox" sx={{ width: 48 }}>
                            <Checkbox
                              indeterminate={someSelectableSelected}
                              checked={allSelectableSelected}
                              disabled={
                                selectableFacturas.length === 0 ||
                                sendingOfertas
                              }
                              onChange={handleToggleSelectAll}
                              inputProps={{
                                "aria-label": "Seleccionar facturas sin oferta",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={headerCellSx}>Folio</TableCell>
                          <TableCell sx={headerCellSx}>Receptor</TableCell>
                          <TableCell sx={headerCellSx}>Fecha emisión</TableCell>
                          <TableCell sx={headerCellSx}>Monto total</TableCell>
                          <TableCell sx={headerCellSx}>Oferta</TableCell>
                          <TableCell sx={headerCellSx}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {facturas.map((factura) => {
                          const canSelect = facturaPuedeSeleccionarseParaOfertaGrupal(
                            factura,
                            Boolean(borradores[factura.id]),
                          );
                          const isSelected = selectedIdSet.has(factura.id);
                          return (
                          <TableRow
                            key={factura.id}
                            sx={{
                              backgroundColor: isSelected
                                ? "var(--color-bg-accent-secondary)"
                                : undefined,
                              "&:hover": {
                                backgroundColor: isSelected
                                  ? "var(--color-bg-accent-secondary)"
                                  : "var(--color-bg-default-tertiary)",
                              },
                              "&:last-child td": { borderBottom: 0 },
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Tooltip
                                title={
                                  canSelect
                                    ? ""
                                    : "Esta factura ya tiene una oferta"
                                }
                              >
                                <span>
                                  <Checkbox
                                    checked={isSelected}
                                    disabled={!canSelect || sendingOfertas}
                                    onChange={() =>
                                      handleToggleSelectFactura(factura)
                                    }
                                    inputProps={{
                                      "aria-label": `Seleccionar factura ${factura.folio}`,
                                    }}
                                  />
                                </span>
                              </Tooltip>
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
                              <Box>
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
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "var(--color-fg-default-secondary)",
                                }}
                              >
                                {formatDate(factura.fechaEmision)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: "var(--color-fg-default-primary)",
                                }}
                              >
                                {formatCurrency(factura.montoTotal)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <FacturaGrupoOfertaCell
                                factura={factura}
                                hasBorrador={Boolean(borradores[factura.id])}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Ver factura">
                                <IconButton
                                  size="small"
                                  onClick={() => handleVerDetalle(factura)}
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
                </TableContainer>

                <Alert
                  severity="info"
                  icon={<InfoOutlined fontSize="inherit" />}
                  sx={{
                    mt: 2,
                    backgroundColor: "var(--color-bg-accent-secondary)",
                    color: "var(--color-fg-default-primary)",
                    "& .MuiAlert-icon": {
                      color: "var(--color-fg-accent-primary)",
                    },
                  }}
                >
                  Selecciona al menos dos facturas sin oferta y haz clic en
                  &quot;Crear oferta grupal&quot; para aplicar las mismas
                  condiciones. También puedes guardar un borrador en cada
                  factura y enviarlo con &quot;Enviar oferta al grupo&quot;, o
                  enviar una oferta individual desde el detalle de cada
                  factura.
                </Alert>
              </>
            )}
          </SectionPanel>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: "var(--color-bg-default-primary)",
          borderTop: "1px solid var(--color-border-default-primary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={sendingOfertas}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "var(--color-fg-default-secondary)",
            color: "var(--color-fg-default-secondary)",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={
            sendingOfertas ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Send />
            )
          }
          disabled={!canSend || sendingOfertas}
          onClick={handleEnviarOfertaAlGrupo}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "var(--color-fg-on-accent-primary)",
            backgroundColor: "var(--color-bg-accent-primary)",
            "&:hover": {
              backgroundColor: "var(--color-bg-accent-primary-hover)",
            },
            "&:disabled": {
              backgroundColor: "var(--color-bg-disabled-primary)",
              color: "var(--color-fg-disabled-primary)",
            },
          }}
        >
          Enviar oferta al grupo
        </Button>
      </Box>

      <FacturaGrupoOfertaGrupalDrawer
        open={ofertaGrupalOpen}
        onClose={handleCloseOfertaGrupal}
        facturas={facturasSeleccionadas}
        factoringId={factoringId}
        plazo={grupo.plazo}
        sending={sendingOfertas}
        error={grupalSendError}
        errorReason={grupalSendErrorReason}
        onCreate={handleCrearOfertaGrupal}
      />

      <FacturaGrupoFactoringDetalleDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        facturaId={detalleFacturaId}
        factoringId={factoringId}
        borrador={
          detalleFacturaId ? borradores[detalleFacturaId] ?? null : null
        }
        onSaveBorrador={handleSaveBorrador}
        onEnviarIndividual={handleEnviarOfertaIndividual}
        onDeleteBorrador={handleDeleteBorrador}
        onOfertaActualizada={() => {
          void loadDetalle();
        }}
        sending={sendingOfertas}
        grupoPlazo={grupo?.plazo || 0}
        initialTab={drawerTab}
        ofertaId={ofertaIdParam}
        onTabChange={handleDrawerTabChange}
      />

      <Dialog
        open={sendConfirmOpen}
        onClose={() => !sendingOfertas && setSendConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "var(--radius-l)" } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          ¿Enviar oferta al grupo?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Se enviarán {borradoresCount} oferta
            {borradoresCount === 1 ? "" : "s"} borrador
            {borradoresCount === 1 ? "" : "es"} al grupo. Las facturas sin
            borrador no se incluirán.
          </Typography>
          {sendError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {sendError}
              </Typography>
              {sendErrorReason && (
                <Typography variant="body2" sx={{ mt: 0.75 }}>
                  {sendErrorReason}
                </Typography>
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setSendConfirmOpen(false)}
            disabled={sendingOfertas}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleConfirmEnviarOfertaAlGrupo();
            }}
            disabled={sendingOfertas}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
            }}
          >
            {sendingOfertas ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Enviar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={sendSuccessOpen}
        autoHideDuration={4000}
        onClose={() => setSendSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSendSuccessOpen(false)}
          sx={{ width: "100%" }}
        >
          Oferta enviada correctamente.
        </Alert>
      </Snackbar>

      <Snackbar
        open={individualSendErrorOpen}
        autoHideDuration={6000}
        onClose={() => setIndividualSendErrorOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setIndividualSendErrorOpen(false)}
          sx={{ width: "100%" }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {sendError || "No se pudo enviar la oferta individual."}
          </Typography>
          {sendErrorReason && (
            <Typography variant="body2" sx={{ mt: 0.75 }}>
              {sendErrorReason}
            </Typography>
          )}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default FacturaGrupoFactoringDetalle;
