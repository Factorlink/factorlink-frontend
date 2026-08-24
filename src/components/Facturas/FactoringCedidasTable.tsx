import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { CheckCircle, Visibility, MoreVert, Refresh } from "@mui/icons-material";
import SortableTableHeader from "./SortableTableHeader";
import { useFacturas } from "../../hooks/useFacturas";
import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";
import FacturasFilters, {
  isArrayFilterKey,
  isFilterValueActive,
  type FacturasFiltersValues,
} from "./FacturasFilters";
import { INITIAL_FILTERS } from "../../utils/consts";
import { getFacturaStatusConfig } from "../../theme";
import {
  tableShellSx,
  tableScrollSx,
  tableWideSx,
  toolbarRowSx,
  paginationSelectSx,
} from "../../theme/layoutStyles";

interface FactoringCedidasTableProps {
  factoringId: string;
  onMetaChange?: (meta: Meta) => void;
}

const SORTABLE_COLUMNS = [
  { field: "folio", label: "Folio" },
  { field: "razonSocialEmisor", label: "Emisor" },
  { field: "razonSocialReceptor", label: "Receptor" },
  { field: "fechaEmision", label: "Fecha Emisión" },
  { field: "montoTotal", label: "Monto Total" },
  { field: "createdAt", label: "Fecha Cesión" },
];

const formatCurrency = (value: string | number | null | undefined) => {
  if (value == null || value === "") return "—";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const FactoringCedidasTable = ({
  factoringId,
  onMetaChange,
}: FactoringCedidasTableProps) => {
  const { getFacturasCedidasByFactoringId, loading } = useFacturas();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [error, setError] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const requestIdRef = useRef(0);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [order, setOrder] = useState(searchParams.get("order") || "DESC");
  const [filters, setFilters] = useState<FacturasFiltersValues>(() => {
    const newFilters = { ...INITIAL_FILTERS };
    (Object.keys(INITIAL_FILTERS) as Array<keyof FacturasFiltersValues>).forEach(
      (key) => {
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
      },
    );
    return newFilters;
  });

  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: Number(searchParams.get("limit")) || 10,
    page: Number(searchParams.get("page")) || 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
    totalGeneral: 0,
  });

  const writeSearchParams = (
    nextFilters: FacturasFiltersValues,
    nextSortBy: string,
    nextOrder: string,
    page?: number,
    limit?: number,
  ) => {
    const params = new URLSearchParams();
    (Object.keys(nextFilters) as Array<keyof FacturasFiltersValues>).forEach(
      (key) => {
        const value = nextFilters[key];
        if (!isFilterValueActive(value)) return;
        if (isArrayFilterKey(key)) {
          (value as string[]).forEach((item) => {
            if (item) params.append(key, item);
          });
          return;
        }
        params.set(key, value as string);
      },
    );
    const currentPage = page ?? meta.page;
    const currentLimit = limit ?? meta.limit;
    if (currentPage !== 1) params.set("page", String(currentPage));
    if (currentLimit !== 10) params.set("limit", String(currentLimit));
    if (nextSortBy) params.set("sortBy", nextSortBy);
    if (nextSortBy && nextOrder) params.set("order", nextOrder);
    setSearchParams(params);
  };

  const updateSearchParams = (
    newSortBy: string,
    newOrder: string,
    page?: number,
    limit?: number,
  ) => {
    writeSearchParams(filters, newSortBy, newOrder, page, limit);
  };

  const handleSort = (field: string) => {
    let newSortBy: string;
    let newOrder: string;
    if (sortBy === field) {
      if (order === "ASC") {
        newOrder = "DESC";
        newSortBy = field;
      } else if (order === "DESC") {
        newOrder = "";
        newSortBy = "";
      } else {
        newOrder = "ASC";
        newSortBy = field;
      }
    } else {
      newSortBy = field;
      newOrder = "ASC";
    }
    setSortBy(newSortBy);
    setOrder(newOrder);
    updateSearchParams(newSortBy, newOrder);
  };

  const fetchData = useCallback(async () => {
    if (!factoringId) return;
    const requestId = ++requestIdRef.current;
    try {
      setError(false);
      const response = await getFacturasCedidasByFactoringId({
        page: meta.page,
        limit: meta.limit,
        factoringId,
        sortBy: sortBy || undefined,
        order: sortBy ? order : undefined,
        folio: filters.folio || undefined,
        rutReceptor: filters.rutReceptor || undefined,
        razonSocialReceptor:
          filters.razonSocialReceptor.length > 0
            ? filters.razonSocialReceptor
            : undefined,
        minMontoTotal: filters.minMontoTotal
          ? Number(filters.minMontoTotal)
          : undefined,
        maxMontoTotal: filters.maxMontoTotal
          ? Number(filters.maxMontoTotal)
          : undefined,
      });
      if (requestId !== requestIdRef.current) return;
      setFacturas(response?.data || []);
      if (response?.meta) {
        setMeta(response.meta);
        onMetaChange?.(response.meta);
      }
    } catch {
      if (requestId !== requestIdRef.current) return;
      setError(true);
      setFacturas([]);
    }
  }, [factoringId, meta.page, meta.limit, sortBy, order, filters]);

  useEffect(() => {
    fetchData();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchData]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setMeta((prev) => ({ ...prev, page: value }));
    updateSearchParams(sortBy, order, value, meta.limit);
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    setMeta((prev) => ({ ...prev, limit: value, page: 1 }));
    updateSearchParams(sortBy, order, 1, value);
  };

  const handleApplyFilters = (newFilters: FacturasFiltersValues) => {
    setFilters(newFilters);
    setMeta((prev) => ({ ...prev, page: 1 }));
    writeSearchParams(newFilters, sortBy, order, 1, meta.limit);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setMeta((prev) => ({ ...prev, page: 1 }));
    writeSearchParams(INITIAL_FILTERS, sortBy, order, 1, meta.limit);
  };

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

  const handleVerFactura = () => {
    if (selectedFactura) {
      navigate(`/facturas/${selectedFactura.id}/factoring`, {
        state: { from: `${location.pathname}${location.search}` },
      });
    }
    handleMenuClose();
  };

  const hasActiveFilters = Object.values(filters).some(isFilterValueActive);

  return (
    <>
      <FacturasFilters
        hideEstado
        razonesSocialesTab="cedidas"
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
          {meta.total} facturas encontradas
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={tableShellSx}>
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
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CheckCircle
              sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)", mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}
            >
              No pudimos cargar las facturas. Intenta nuevamente.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchData}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Reintentar
            </Button>
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
            <CheckCircle
              sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)", mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}
            >
              Aún no tienes facturas cedidas.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-tertiary)", mt: 1 }}
            >
              {hasActiveFilters
                ? "No se encontraron facturas con los criterios de búsqueda"
                : "Las facturas cedidas a tu Factoring aparecerán aquí"}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={tableScrollSx}>
              <Table sx={tableWideSx}>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}
                  >
                    {SORTABLE_COLUMNS.map((column) => (
                      <SortableTableHeader
                        key={column.field}
                        field={column.field}
                        label={column.label}
                        currentSortBy={sortBy}
                        currentOrder={order}
                        onSort={handleSort}
                      />
                    ))}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--color-fg-default-secondary)",
                      }}
                    >
                      Cesión
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--color-fg-default-secondary)",
                      }}
                    >
                      Estado
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--color-fg-default-secondary)",
                      }}
                    >
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturas.map((factura) => {
                    const statusConfig = getFacturaStatusConfig(
                      factura.estado || "CEDIDA",
                    );
                    const oferta = factura.ofertaFactoring;
                    const cesionFecha =
                      oferta?.fechaOperacion || factura.createdAt;
                    const cesionMonto =
                      oferta?.montoAGirar ??
                      oferta?.montoAdelanto ??
                      factura.montoFinanciar;

                    return (
                      <TableRow
                        key={factura.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "var(--color-bg-default-tertiary)",
                          },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "var(--color-fg-accent-primary)",
                                fontWeight: 600,
                              }}
                            >
                              #{factura.folio}
                            </Typography>
                            {factura.siiId && (
                              <Typography
                                variant="caption"
                                sx={{ color: "var(--color-fg-default-secondary)" }}
                              >
                                SII ID {factura.siiId}
                              </Typography>
                            )}
                          </Box>
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
                              {factura.razonSocialEmisor || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "var(--color-fg-default-secondary)" }}
                            >
                              {factura.rutEmisor || ""}
                            </Typography>
                          </Box>
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
                              sx={{ color: "var(--color-fg-default-secondary)" }}
                            >
                              {factura.rutReceptor || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--color-fg-default-secondary)" }}
                          >
                            {formatDate(factura.fechaEmision)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--color-fg-default-primary)",
                              fontWeight: 500,
                            }}
                          >
                            {formatCurrency(factura.montoTotal)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--color-fg-default-secondary)" }}
                          >
                            {formatDate(factura.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "var(--color-fg-success-primary)",
                                fontWeight: 600,
                              }}
                            >
                              {formatCurrency(cesionMonto)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "var(--color-fg-default-secondary)" }}
                            >
                              {formatDate(cesionFecha)}
                              {oferta?.tasa != null && oferta.tasa !== ""
                                ? ` · ${oferta.tasa}%`
                                : ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusConfig.icon as React.ReactElement}
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
                            sx={{ color: "var(--color-fg-default-secondary)" }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>

            {meta.lastPage > 1 && (
              <Box
                sx={[
                  toolbarRowSx,
                  {
                    borderTop: "1px solid var(--color-border-default-primary)",
                  },
                ]}
              >
                <FormControl size="small" sx={paginationSelectSx}>
                  <InputLabel id="factoring-cedidas-limit-label">
                    Filas por página
                  </InputLabel>
                  <Select
                    labelId="factoring-cedidas-limit-label"
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
                      color: "var(--color-fg-on-accent-primary)",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "var(--shadow-popover)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleVerFactura}>
          <ListItemIcon>
            <Visibility sx={{ color: "var(--color-fg-default-secondary)" }} />
          </ListItemIcon>
          <ListItemText primary="Ver factura" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default FactoringCedidasTable;
