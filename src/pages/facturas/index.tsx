import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import {
  Description,
  Sync,
  Storefront,
  CheckCircle,
  MoreVert,
  Visibility,
  Delete,
  Send,
} from "@mui/icons-material";
import MarketplaceFacturasTable from "../../components/Facturas/MarketplaceFacturasTable";
import OfertasFacturasTable from "../../components/Facturas/OfertasFacturasTable";
import CedidasFacturasTable from "../../components/Facturas/CedidasFacturasTable";
import SyncFacturasSiiModal from "../../components/Modals/SyncFacturasSiiModal";
import DeleteFacturaModal from "../../components/Modals/DeleteFacturaModal";
import RemoveMarketplaceModal from "../../components/Modals/RemoveMarketplaceModal";
import DocumentsRequiredModal from "../../components/Modals/DocumentsRequiredModal";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FacturasFilters, {
  type FacturasFiltersValues,
} from "../../components/Facturas/FacturasFilters";
import SortableTableHeader from "../../components/Facturas/SortableTableHeader";
import Layout from "../../components/Layout";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";
import { INITIAL_FILTERS, SORTABLE_COLUMNS } from "../../utils/consts";

const getStatusConfig = (estado: string) => {
  switch (estado) {
    case "CARGADA":
      return {
        label: "CARGADA",
        color: "#64748B",
        bgColor: "#F1F5F9",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "EN_MARKETPLACE":
      return {
        label: "EN MARKETPLACE",
        color: "#00BCD4",
        bgColor: "rgba(0, 188, 212, 0.1)",
        icon: <Storefront sx={{ fontSize: 14 }} />,
      };
    case "CEDIDA":
      return {
        label: "CEDIDA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <CheckCircle sx={{ fontSize: 14 }} />,
      };
    case "CON_OFERTAS":
      return {
        label: "CON OFERTAS",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <CheckCircle sx={{ fontSize: 14 }} />,
      };
    default:
      return {
        label: estado || "N/A",
        color: "#64748B",
        bgColor: "#F1F5F9",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
  }
};

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TAB_ROUTES = ["/facturas", "/facturas/marketplace", "/facturas/ofertas", "/facturas/cedidas"];

const getTabFromPath = (pathname: string) => {
  const idx = TAB_ROUTES.indexOf(pathname);
  return idx >= 0 ? idx : 0;
};

const Facturas = () => {
  const { currentRole } = useAuthStore();
  const { loading, getFacturas } = useFacturas();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState<Factura[]>([]);

  const activeTab = getTabFromPath(location.pathname);
  const prevTabRef = useRef(activeTab);

  const [filters, setFilters] = useState<FacturasFiltersValues>(() => {
    const newFilters = { ...INITIAL_FILTERS };
    (
      Object.keys(INITIAL_FILTERS) as Array<keyof FacturasFiltersValues>
    ).forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        newFilters[key] = value;
      }
    });
    return newFilters;
  });

  const [meta, setMeta] = useState<Meta>(() => ({
    lastPage: 1,
    limit: Number(searchParams.get("limit")) || 10,
    page: Number(searchParams.get("page")) || 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
  }));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeMarketplaceModalOpen, setRemoveMarketplaceModalOpen] = useState(false);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] = useState(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    factura: Factura,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFactura(factura);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFactura(null);
  };

  const handleVerDetalle = () => {
    if (selectedFactura) {
      navigate(`/facturas/${selectedFactura.id}`);
    }
    handleMenuClose();
  };

  const isInMarketplace = (factura: Factura | null) => {
    if (!factura) return false;
    return factura.estado === "EN_MARKETPLACE" || factura.estado === "CON_OFERTAS";
  };

  const handleEliminar = () => {
    if (isInMarketplace(selectedFactura)) {
      setRemoveMarketplaceModalOpen(true);
    } else {
      setDeleteModalOpen(true);
    }
    setAnchorEl(null);
  };

  const handleDeleteSuccess = () => {
    fetchFacturas(filters);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedFactura(null);
  };

  const handleRemoveMarketplaceSuccess = () => {
    fetchFacturas(filters);
  };

  const handleCloseRemoveMarketplaceModal = () => {
    setRemoveMarketplaceModalOpen(false);
    setSelectedFactura(null);
  };

  const handleEnviarCotizar = () => {
    if (selectedFactura) {
      if (currentRole && currentRole.nivel >= 3) {
        navigate(`/facturas/${selectedFactura.id}/cotizar`);
      } else {
        setDocumentsRequiredModalOpen(true);
      }
    }
    handleMenuClose();
  };

  const canEnviarCotizar = (factura: Factura | null) => {
    if (!factura) return false;
    const estado = factura.estado?.toLowerCase();
    return estado === "cargada";
  };

  const isCargada = (factura: Factura | null) => {
    if (!factura) return false;
    return factura.estado?.toLowerCase() === "cargada";
  };

  const fetchFacturas = useCallback(
    async (currentFilters: FacturasFiltersValues) => {
      if (!currentRole?.empresaId) return;

      const params: Record<string, string | number> = {
        page: meta.page,
        limit: meta.limit,
        empresaId: currentRole.empresaId,
      };

      // Add filter params if they have values
      if (currentFilters.rutEmisor) params.rutEmisor = currentFilters.rutEmisor;
      if (currentFilters.rutReceptor)
        params.rutReceptor = currentFilters.rutReceptor;
      if (currentFilters.razonSocialReceptor)
        params.razonSocialReceptor = currentFilters.razonSocialReceptor;
      if (currentFilters.folio) params.folio = currentFilters.folio;
      if (currentFilters.estado) params.estado = currentFilters.estado;
      if (currentFilters.montoTotal)
        params.montoTotal = Number(currentFilters.montoTotal);
      if (currentFilters.minMontoTotal)
        params.minMontoTotal = Number(currentFilters.minMontoTotal);
      if (currentFilters.maxMontoTotal)
        params.maxMontoTotal = Number(currentFilters.maxMontoTotal);
      if (currentFilters.montoNeto)
        params.montoNeto = Number(currentFilters.montoNeto);
      if (currentFilters.minMontoNeto)
        params.minMontoNeto = Number(currentFilters.minMontoNeto);
      if (currentFilters.maxMontoNeto)
        params.maxMontoNeto = Number(currentFilters.maxMontoNeto);
      if (currentFilters.detalleIva)
        params.detalleIva = Number(currentFilters.detalleIva);
      if (currentFilters.minDetalleIva)
        params.minDetalleIva = Number(currentFilters.minDetalleIva);
      if (currentFilters.maxDetalleIva)
        params.maxDetalleIva = Number(currentFilters.maxDetalleIva);
      if (currentFilters.sortBy) params.sortBy = currentFilters.sortBy;
      if (currentFilters.order) params.order = currentFilters.order;

      const { data, meta: metaResponse } = await getFacturas(params as any);
      setFacturas(data || []);
      setMeta(metaResponse);
    },
    [currentRole?.empresaId, meta.page, meta.limit],
  );

  // Reset filters, meta and URL params when switching tabs
  useEffect(() => {
    const prevTab = prevTabRef.current;
    if (prevTab !== activeTab) {
      prevTabRef.current = activeTab;
      // Clear search params when changing tabs (each tab has independent URL state)
      setSearchParams(new URLSearchParams());
      // Always reset filters and meta when switching tabs
      const resetFilters = { ...INITIAL_FILTERS };
      setFilters(resetFilters);
      setMeta((prev) => ({ ...prev, page: 1 }));
      
      fetchFacturas(resetFilters);
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 0) {
      fetchFacturas(filters);
    }
  }, [currentRole?.empresaId, meta.page, meta.limit]);

  const updateSearchParams = (
    newFilters: FacturasFiltersValues,
    page?: number,
    limit?: number,
  ) => {
    const newSearchParams = new URLSearchParams();
    
    // Add pagination params (only if not default values)
    const currentPage = page ?? meta.page;
    const currentLimit = limit ?? meta.limit;
    if (currentPage !== 1) {
      newSearchParams.set("page", String(currentPage));
    }
    if (currentLimit !== 10) {
      newSearchParams.set("limit", String(currentLimit));
    }
    
    // Add filter params
    (Object.keys(newFilters) as Array<keyof FacturasFiltersValues>).forEach(
      (key) => {
        if (newFilters[key]) {
          newSearchParams.set(key, newFilters[key]);
        }
      },
    );
    setSearchParams(newSearchParams);
  };

  const handleApplyFilters = (newFilters: FacturasFiltersValues) => {
    setFilters(newFilters);
    setMeta((prev) => ({ ...prev, page: 1 }));
    updateSearchParams(newFilters, 1, meta.limit);
    fetchFacturas(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setMeta((prev) => ({ ...prev, page: 1 }));
    updateSearchParams(INITIAL_FILTERS, 1, meta.limit);
    fetchFacturas(INITIAL_FILTERS);
  };

  const handleSort = (field: string) => {
    let newOrder: string;
    let newSortBy: string;

    if (filters.sortBy === field) {
      // Toggle order or clear sorting
      if (filters.order === "ASC") {
        newOrder = "DESC";
        newSortBy = field;
      } else if (filters.order === "DESC") {
        newOrder = "";
        newSortBy = "";
      } else {
        newOrder = "ASC";
        newSortBy = field;
      }
    } else {
      // New field, start with ASC
      newSortBy = field;
      newOrder = "ASC";
    }

    const newFilters = { ...filters, sortBy: newSortBy, order: newOrder };
    setFilters(newFilters);
    updateSearchParams(newFilters, meta.page, meta.limit);
    fetchFacturas(newFilters);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setMeta((prev) => ({ ...prev, page: value }));
    updateSearchParams(filters, value, meta.limit);
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    setMeta((prev) => ({ ...prev, limit: value, page: 1 }));
    updateSearchParams(filters, 1, value);
  };

  return (
    <Layout>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Description sx={{ color: "#64748B", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                Gestión de Facturas
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Administra las facturas de tu empresa
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Sync />}
              onClick={() => setSyncModalOpen(true)}
              sx={{
                backgroundColor: "#00BCD4",
                "&:hover": { backgroundColor: "#334155" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                color: "white",
              }}
            >
              Sincronizar SII
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748B", mb: 0.5 }}>
              Total Facturas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
              {meta.total}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748B", mb: 0.5 }}>
              Cargadas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
              {meta.totalCargada}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748B", mb: 0.5 }}>
              En Marketplace
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#00BCD4" }}>
              {meta.totalEnMarketplace}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 3,
              p: 2.5,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748B", mb: 0.5 }}>
              Cedidas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#00A86B" }}>
              {meta.totalCedida}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => {
              navigate(TAB_ROUTES[newValue]);
            }}
          >
            <Tab
              icon={<Description sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Todas las facturas
                  {meta.total > 0 && (
                    <Chip
                      label={meta.total}
                      size="small"
                      sx={{
                        height: 22,
                        minWidth: 22,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: activeTab === 0 ? "#00BCD4" : "#64748B",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              icon={<Storefront sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  En Marketplace
                  {meta.totalEnMarketplace > 0 && (
                    <Chip
                      label={meta.totalEnMarketplace}
                      size="small"
                      sx={{
                        height: 22,
                        minWidth: 22,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: activeTab === 1 ? "#00BCD4" : "#64748B",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              icon={<Visibility sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Ofertas
                  {meta.totalConOfertas > 0 && (
                    <Chip
                      label={meta.totalConOfertas}
                      size="small"
                      sx={{
                        height: 22,
                        minWidth: 22,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: activeTab === 2 ? "#00BCD4" : "#64748B",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              icon={<CheckCircle sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Cedidas
                  {meta.totalCedida > 0 && (
                    <Chip
                      label={meta.totalCedida}
                      size="small"
                      sx={{
                        height: 22,
                        minWidth: 22,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: activeTab === 3 ? "#00BCD4" : "#64748B",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 ? (
          <>
            {/* Filters Section */}
            <FacturasFilters
              key={activeTab}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              loading={loading}
            />
            {/* Table */}
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 8,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : facturas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 8,
                  }}
                >
                  <Description sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#64748B", fontWeight: 500 }}
                  >
                    No hay facturas disponibles
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
                    {Object.values(filters).some((v) => v !== "")
                      ? "No se encontraron facturas con los criterios de búsqueda"
                      : "Sincroniza con el SII o agrega facturas manualmente para comenzar"}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                        {SORTABLE_COLUMNS.map((column) => (
                          <SortableTableHeader
                            key={column.field}
                            field={column.field}
                            label={column.label}
                            currentSortBy={filters.sortBy}
                            currentOrder={filters.order}
                            onSort={handleSort}
                          />
                        ))}
                        <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {facturas.map((factura) => {
                        const statusConfig = getStatusConfig(factura.estado);
                        return (
                          <TableRow
                            key={factura.id}
                            sx={{
                              "&:hover": { backgroundColor: "#F8FAFC" },
                              "&:last-child td": { borderBottom: 0 },
                            }}
                          >
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: "#00BCD4", fontWeight: 600 }}
                              >
                                {factura.folio}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: "#1E293B" }}
                                >
                                  {factura.razonSocialReceptor || "N/A"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#64748B" }}
                                >
                                  {factura.rutReceptor || ""}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: "#64748B" }}>
                                {formatDate(factura.fechaEmision)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: "#1E293B", fontWeight: 500 }}
                              >
                                {formatCurrency(factura.montoTotal)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ color: "#00A86B", fontWeight: 600 }}
                              >
                                {formatCurrency(factura.montoFinanciar)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${factura.plazo || 0} días`}
                                size="small"
                                sx={{
                                  backgroundColor: "#F1F5F9",
                                  color: "#475569",
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={statusConfig.icon}
                                label={statusConfig.label}
                                size="small"
                                sx={{
                                  backgroundColor: statusConfig.bgColor,
                                  color: statusConfig.color,
                                  fontWeight: 500,
                                  "& .MuiChip-icon": {
                                    color: statusConfig.color,
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, factura)}
                                sx={{ color: "#64748B" }}
                              >
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {meta.lastPage > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        borderTop: "1px solid #E2E8F0",
                        px: 2,
                        gap: 2,
                      }}
                    >
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="limit-label">Filas por página</InputLabel>
                        <Select
                          labelId="limit-label"
                          value={String(meta.limit)}
                          label="Filas por página"
                          onChange={handleLimitChange}
                        >
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                      <Pagination
                        count={meta.lastPage}
                        page={meta.page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        sx={{
                          "& .MuiPaginationItem-root.Mui-selected": {
                            color: "white",
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </TableContainer>
          </>
        ) : activeTab === 1 ? (
          <MarketplaceFacturasTable
            empresaId={currentRole?.empresaId || ""}
            onRemoveSuccess={() => fetchFacturas(filters)}
          />
        ) : activeTab === 2 ? (
          <OfertasFacturasTable
            empresaId={currentRole?.empresaId || ""}
          />
        ) : (
          <CedidasFacturasTable
            empresaId={currentRole?.empresaId || ""}
          />
        )}

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              minWidth: 180,
            },
          }}
        >
          <MenuItem onClick={handleVerDetalle}>
            <ListItemIcon>
              <Visibility sx={{ color: "#64748B" }} />
            </ListItemIcon>
            <ListItemText primary="Ver detalle" />
          </MenuItem>
          {
            isInMarketplace(selectedFactura) && (
              <MenuItem onClick={handleEliminar}>
                <ListItemIcon>
                  <StorefrontIcon sx={{ color: "#EF4444" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Quitar del marketplace"
                  sx={{ "& .MuiTypography-root": { color: "#EF4444" } }}
                />
              </MenuItem>
            )
          }
          {
            isCargada(selectedFactura) && (
              <MenuItem onClick={handleEliminar}>
              <ListItemIcon>
                <Delete sx={{ color: "#EF4444" }} />
              </ListItemIcon>
              <ListItemText
                primary="Eliminar"
                sx={{ "& .MuiTypography-root": { color: "#EF4444" } }}
              />
            </MenuItem>
            )
          }
          {canEnviarCotizar(selectedFactura) && (
            <MenuItem onClick={handleEnviarCotizar}>
              <ListItemIcon>
                <Send sx={{ color: "#00BCD4" }} />
              </ListItemIcon>
              <ListItemText
                primary="Enviar a cotizar"
                sx={{ "& .MuiTypography-root": { color: "#00BCD4" } }}
              />
            </MenuItem>
          )}
        </Menu>

        {/* Sync Facturas SII Modal */}
        <SyncFacturasSiiModal
          open={syncModalOpen}
          empresaId={currentRole?.empresaId || ""}
          onClose={() => setSyncModalOpen(false)}
          onSuccess={() => {
            // Refresh facturas after sync
            if (currentRole?.empresaId) {
              getFacturas({
                page: meta.page,
                limit: meta.limit,
                empresaId: currentRole.empresaId,
              }).then(({ data, meta: metaResponse }) => {
                setFacturas(data || []);
                setMeta(metaResponse);
              });
            }
          }}
        />

        {/* Delete Factura Modal */}
        {selectedFactura && (
          <DeleteFacturaModal
            open={deleteModalOpen}
            onClose={handleCloseDeleteModal}
            onSuccess={handleDeleteSuccess}
            facturaData={{
              id: selectedFactura.id,
              folio: selectedFactura.folio,
              razonSocialReceptor: selectedFactura.razonSocialReceptor || "N/A",
              montoTotal: selectedFactura.montoTotal,
            }}
          />
        )}

        {selectedFactura && (
          <RemoveMarketplaceModal
            open={removeMarketplaceModalOpen}
            onClose={handleCloseRemoveMarketplaceModal}
            onSuccess={handleRemoveMarketplaceSuccess}
            facturaData={{
              id: selectedFactura.id,
              folio: selectedFactura.folio,
              razonSocialReceptor: selectedFactura.razonSocialReceptor || "N/A",
            }}
          />
        )}

        <DocumentsRequiredModal
          open={documentsRequiredModalOpen}
          onClose={() => setDocumentsRequiredModalOpen(false)}
        />
      </Box>
    </Layout>
  );
};

export default Facturas;
