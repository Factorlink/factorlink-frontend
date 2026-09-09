import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Groups, Visibility } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { formatCurrency } from "./FacturaResumenCard";
import SortableTableHeader from "./SortableTableHeader";
import FacturaGruposFilters from "./FacturaGruposFilters";
import {
  INITIAL_GRUPO_FILTERS,
  isGrupoFilterValueActive,
  readGrupoFiltersFromSearchParams,
  type FacturaGruposFiltersValues,
} from "../../utils/facturaGruposFilters";
import { useFacturaGrupos } from "../../hooks/useFacturaGrupos";
import type { FacturaGrupo } from "../../types/factura";
import type { Meta } from "../../types/meta";
import { getFacturaStatusConfig } from "../../theme";
import {
  getFacturaGrupoCantidad,
  getFacturaGrupoMontoFinanciar,
  getFacturaGrupoMontoTotal,
} from "../../utils/facturaGrupo";
import {
  paginationSelectSx,
  tableScrollSx,
  tableShellSx,
  tableWideSx,
  toolbarRowSx,
} from "../../theme/layoutStyles";

interface FacturaGruposTableProps {
  empresaId: string;
  onMetaChange?: (meta: Meta) => void;
}

const PAGE_LIMIT = 10;

const headerCellSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-secondary)",
} as const;

const FacturaGruposTable = ({
  empresaId,
  onMetaChange,
}: FacturaGruposTableProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFacturaGrupos, loading } = useFacturaGrupos();

  const [grupos, setGrupos] = useState<FacturaGrupo[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [order, setOrder] = useState(searchParams.get("order") || "DESC");
  const [filters, setFilters] = useState<FacturaGruposFiltersValues>(() =>
    readGrupoFiltersFromSearchParams(searchParams),
  );
  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: Number(searchParams.get("limit")) || PAGE_LIMIT,
    page: Number(searchParams.get("page")) || 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
    totalGeneral: 0,
  });

  const writeSearchParams = (
    nextFilters: FacturaGruposFiltersValues,
    nextSortBy: string,
    nextOrder: string,
    page?: number,
    limit?: number,
  ) => {
    const params = new URLSearchParams();
    (Object.keys(nextFilters) as Array<keyof FacturaGruposFiltersValues>).forEach(
      (key) => {
        const value = nextFilters[key];
        if (!isGrupoFilterValueActive(value)) return;
        params.set(key, value);
      },
    );
    const currentPage = page ?? meta.page;
    const currentLimit = limit ?? meta.limit;
    if (currentPage !== 1) params.set("page", String(currentPage));
    if (currentLimit !== PAGE_LIMIT) params.set("limit", String(currentLimit));
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
    setMeta((prev) => ({ ...prev, page: 1 }));
    updateSearchParams(newSortBy, newOrder, 1, meta.limit);
  };

  const fetchGrupos = useCallback(async () => {
    if (!empresaId) return;
    setLoadError(null);
    try {
      const porcentaje = filters.porcentajeFinanciamiento
        ? Number(filters.porcentajeFinanciamiento)
        : undefined;
      const response = await getFacturaGrupos({
        empresaId,
        page: meta.page,
        limit: meta.limit,
        sortBy: sortBy || "createdAt",
        order: sortBy ? order || "ASC" : "DESC",
        ...(filters.nombre ? { nombre: filters.nombre } : {}),
        ...(filters.visibilidad ? { visibilidad: filters.visibilidad } : {}),
        ...(porcentaje != null && Number.isFinite(porcentaje)
          ? { porcentajeFinanciamiento: porcentaje }
          : {}),
      });
      const data = response?.data || [];
      setGrupos(data);
      if (response?.meta) {
        const nextMeta: Meta = {
          lastPage: 1,
          limit: PAGE_LIMIT,
          page: 1,
          total: 0,
          totalCargada: 0,
          totalCedida: 0,
          totalEnMarketplace: 0,
          totalConOfertas: 0,
          totalGeneral: 0,
          ...response.meta,
        };
        setMeta(nextMeta);
        onMetaChange?.(nextMeta);
      }
    } catch (err) {
      console.error("Error fetching factura grupos:", err);
      setGrupos([]);
      setLoadError("No se pudieron cargar los grupos. Intente nuevamente.");
    }
    // getFacturaGrupos is recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaId, meta.page, meta.limit, sortBy, order, filters]);

  useEffect(() => {
    void fetchGrupos();
  }, [fetchGrupos]);

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

  const handleApplyFilters = (newFilters: FacturaGruposFiltersValues) => {
    setFilters(newFilters);
    setMeta((prev) => ({ ...prev, page: 1 }));
    writeSearchParams(newFilters, sortBy, order, 1, meta.limit);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_GRUPO_FILTERS);
    setMeta((prev) => ({ ...prev, page: 1 }));
    writeSearchParams(INITIAL_GRUPO_FILTERS, sortBy, order, 1, meta.limit);
  };

  const hasActiveFilters = (
    Object.keys(filters) as Array<keyof FacturaGruposFiltersValues>
  ).some((key) => isGrupoFilterValueActive(filters[key]));

  const emptyMessage = loadError
    ? loadError
    : hasActiveFilters
      ? "No se encontraron grupos con esos filtros"
      : "Los grupos de cotización que crees aparecerán aquí";

  return (
    <>
      <FacturaGruposFilters
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading}
      />
      <TableContainer component={Paper} sx={tableShellSx}>
        {loading && grupos.length === 0 ? (
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
        ) : grupos.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <Groups
              sx={{
                fontSize: 64,
                color: "var(--color-fg-default-tertiary)",
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}
            >
              No hay grupos
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-tertiary)", mt: 1 }}
            >
              {emptyMessage}
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
                    <SortableTableHeader
                      field="nombre"
                      label="Nombre"
                      currentSortBy={sortBy}
                      currentOrder={order}
                      onSort={handleSort}
                    />
                    <TableCell sx={headerCellSx}>Facturas</TableCell>
                    <TableCell sx={headerCellSx}>Monto total</TableCell>
                    <TableCell sx={headerCellSx}>Monto a financiar</TableCell>
                    <SortableTableHeader
                      field="porcentajeFinanciamiento"
                      label="%"
                      currentSortBy={sortBy}
                      currentOrder={order}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      field="plazo"
                      label="Plazo"
                      currentSortBy={sortBy}
                      currentOrder={order}
                      onSort={handleSort}
                    />
                    <SortableTableHeader
                      field="estado"
                      label="Estado"
                      currentSortBy={sortBy}
                      currentOrder={order}
                      onSort={handleSort}
                    />
                    <TableCell sx={headerCellSx}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grupos.map((grupo) => {
                    const statusConfig = getFacturaStatusConfig(
                      grupo.estado || "",
                    );
                    return (
                      <TableRow
                        key={grupo.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "var(--color-bg-default-tertiary)",
                          },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "var(--color-fg-default-primary)",
                            }}
                          >
                            {grupo.nombre || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {getFacturaGrupoCantidad(grupo)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatCurrency(getFacturaGrupoMontoTotal(grupo))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "var(--color-fg-success-primary)",
                            }}
                          >
                            {formatCurrency(
                              getFacturaGrupoMontoFinanciar(grupo),
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {grupo.porcentajeFinanciamiento != null
                              ? `${grupo.porcentajeFinanciamiento}%`
                              : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${grupo.plazo || 0} días`}
                            size="small"
                            sx={{
                              backgroundColor:
                                "var(--color-bg-default-tertiary)",
                              color: "var(--color-fg-default-primary)",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {grupo.estado ? (
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
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: "var(--color-fg-default-tertiary)" }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Ver grupo">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/facturas/grupos/${grupo.id}`, {
                                  state: { nombre: grupo.nombre },
                                })
                              }
                              sx={{ color: "var(--color-fg-accent-primary)" }}
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
                  <InputLabel id="grupos-limit-label">
                    Filas por página
                  </InputLabel>
                  <Select
                    labelId="grupos-limit-label"
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
    </>
  );
};

export default FacturaGruposTable;
