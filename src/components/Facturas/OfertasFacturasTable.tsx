import { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { Description, Groups, Visibility, MoreVert } from "@mui/icons-material";
import SortableTableHeader from "./SortableTableHeader";
import { useFacturas } from "../../hooks/useFacturas";
import { useSearchParams } from "react-router-dom";

import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";
import OfertasDrawer from "./OfertasDrawer";
import FacturasFilters, {
  isArrayFilterKey,
  isFilterValueActive,
  type FacturasFiltersValues,
} from "./FacturasFilters";
import { INITIAL_FILTERS } from "../../utils/consts";
import {
  tableShellSx,
  tableScrollSx,
  tableWideSx,
  toolbarRowSx,
  paginationSelectSx,
} from "../../theme/layoutStyles";

interface OfertasFacturasTableProps {
  empresaId: string;
  onMetaChange?: (meta: any) => void;
}



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

const OfertasFacturasTable = ({ empresaId, onMetaChange }: OfertasFacturasTableProps) => {
  const { getFacturasConOfertasByEmpresaId, loading } = useFacturas();
  const [searchParams, setSearchParams] = useSearchParams();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [order, setOrder] = useState(searchParams.get("order") || "DESC");
  const [filters, setFilters] = useState<FacturasFiltersValues>(() => {
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
    (Object.keys(nextFilters) as Array<keyof FacturasFiltersValues>).forEach((key) => {
      const value = nextFilters[key];
      if (!isFilterValueActive(value)) return;
      if (isArrayFilterKey(key)) {
        (value as string[]).forEach((item) => {
          if (item) params.append(key, item);
        });
        return;
      }
      params.set(key, value as string);
    });
    const currentPage = page ?? meta.page;
    const currentLimit = limit ?? meta.limit;
    if (currentPage !== 1) params.set("page", String(currentPage));
    if (currentLimit !== 10) params.set("limit", String(currentLimit));
    if (nextSortBy) params.set("sortBy", nextSortBy);
    if (nextSortBy && nextOrder) params.set("order", nextOrder);
    setSearchParams(params);
  };

  const updateSearchParams = (newSortBy: string, newOrder: string, page?: number, limit?: number) => {
    writeSearchParams(filters, newSortBy, newOrder, page, limit);
  };

  const handleSort = (field: string) => {
    let newSortBy: string;
    let newOrder: string;
    if (sortBy === field) {
      if (order === "ASC") { newOrder = "DESC"; newSortBy = field; }
      else if (order === "DESC") { newOrder = ""; newSortBy = ""; }
      else { newOrder = "ASC"; newSortBy = field; }
    } else {
      newSortBy = field;
      newOrder = "ASC";
    }
    setSortBy(newSortBy);
    setOrder(newOrder);
    updateSearchParams(newSortBy, newOrder);
  };

  const fetchData = useCallback(async () => {
    if (!empresaId) return;
    try {
      const response = await getFacturasConOfertasByEmpresaId({
        page: meta.page,
        limit: meta.limit,
        empresaId,
        sortBy: sortBy || undefined,
        order: sortBy ? order : undefined,
        folio: filters.folio || undefined,
        rutReceptor: filters.rutReceptor || undefined,
        razonSocialReceptor:
          filters.razonSocialReceptor.length > 0
            ? filters.razonSocialReceptor
            : undefined,
      });
      setFacturas(response?.data || []);
      if (response?.meta) {
        setMeta(response.meta);
        onMetaChange?.(response.meta);
      }
    } catch {
      setFacturas([]);
    }
  }, [empresaId, meta.page, meta.limit, sortBy, order, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
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

  const hasActiveFilters = Object.values(filters).some(isFilterValueActive);

  const getOfertasCount = (factura: Factura) => {
    return factura.numeroOfertasRecibidas ?? (factura as any).ofertasCount ?? 0;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, factura: Factura) => {
    setAnchorEl(event.currentTarget);
    setSelectedFactura(factura);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVerOfertas = () => {
    setDrawerOpen(true);
    setAnchorEl(null);
  };

  return (
    <>
      <FacturasFilters
        hideEstado
        razonesSocialesTab="con_ofertas"
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading}
      />
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
          <Description sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}>
            No hay facturas con ofertas
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-tertiary)", mt: 1 }}>
            {hasActiveFilters
              ? "No se encontraron facturas con los criterios de búsqueda"
              : "Las facturas que reciban ofertas aparecerán aquí"}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={tableScrollSx}>
          <Table sx={tableWideSx}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}>
                <SortableTableHeader field="folio" label="Folio" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="razonSocialReceptor" label="Receptor" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="fechaEmision" label="Fecha Emisión" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="montoTotal" label="Monto Total" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="montoFinanciar" label="Monto a Financiar" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="plazo" label="Plazo" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>Ofertas Recibidas</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow
                  key={factura.id}
                  sx={{
                    "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--color-fg-accent-primary)", fontWeight: 600 }}
                    >
                      {factura.folio}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                      >
                        {factura.razonSocialReceptor || "N/A"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                        {factura.rutReceptor || ""}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                      {formatDate(factura.fechaEmision)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--color-fg-default-primary)", fontWeight: 500 }}
                    >
                      {formatCurrency(factura.montoTotal)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--color-fg-success-primary)", fontWeight: 600 }}
                    >
                      {formatCurrency(factura.montoFinanciar)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${factura.plazo || 0} días`}
                      size="small"
                      sx={{
                        backgroundColor: "var(--color-bg-default-tertiary)",
                        color: "var(--color-fg-default-primary)",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Groups sx={{ fontSize: 18, color: "var(--color-fg-default-secondary)" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--color-fg-default-primary)", fontWeight: 500 }}
                      >
                        {getOfertasCount(factura)}
                      </Typography>
                    </Box>
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
              ))}
            </TableBody>
          </Table>
          </Box>

          {/* Pagination */}
          {meta.lastPage > 1 && (
            <Box
              sx={[
                toolbarRowSx,
                { borderTop: "1px solid var(--color-border-default-primary)" },
              ]}
            >
              <FormControl size="small" sx={paginationSelectSx}>
                <InputLabel id="ofertas-limit-label">Filas por página</InputLabel>
                <Select
                  labelId="ofertas-limit-label"
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
        <MenuItem onClick={handleVerOfertas}>
          <ListItemIcon>
            <Visibility sx={{ color: "var(--color-fg-default-secondary)" }} />
          </ListItemIcon>
          <ListItemText primary="Ver ofertas" />
        </MenuItem>
      </Menu>

      <OfertasDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        factura={selectedFactura}
      />
    </>
  );
};

export default OfertasFacturasTable;
