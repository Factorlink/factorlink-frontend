import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Storefront, Visibility, MoreVert } from "@mui/icons-material";
import SortableTableHeader from "../../components/Facturas/SortableTableHeader";
import Layout from "../../components/Layout";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  tableShellSx,
  tableScrollSx,
  tableWideSx,
  toolbarRowSx,
  paginationSelectSx,
  pageHeaderSx,
  appContentSx,
} from "../../theme/layoutStyles";

const MARKETPLACE_SORTABLE_COLUMNS = [
  { field: "razonSocialEmisor", label: "Empresa Emisora" },
  { field: "razonSocialReceptor", label: "Empresa Receptora" },
  { field: "folio", label: "Folio" },
  { field: "fechaEmision", label: "Fecha Emisión" },
  { field: "montoTotal", label: "Monto Total" },
];

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

const Marketplace = () => {
  const { currentRole } = useAuthStore();
  const { loading, getFacturasByFactoringId } = useFacturas();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [order, setOrder] = useState(searchParams.get("order") || "");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFactura, setMenuFactura] = useState<Factura | null>(null);

  const [meta, setMeta] = useState<Meta>(() => ({
    lastPage: 1,
    limit: Number(searchParams.get("limit")) || 10,
    page: Number(searchParams.get("page")) || 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
    totalGeneral: 0,
  }));

  const fetchFacturas = useCallback(
    async (currentSortBy: string, currentOrder: string) => {
      if (!currentRole?.factoringId) return;

      const params: Record<string, string | number> = {
        page: meta.page,
        limit: meta.limit,
        factoringId: currentRole.factoringId,
      };

      if (currentSortBy) params.sortBy = currentSortBy;
      if (currentOrder) params.order = currentOrder;

      try {
        setError(null);
        const { data, meta: metaResponse } = await getFacturasByFactoringId(
          params as any,
        );
        setFacturas(data || []);
        setMeta(metaResponse);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || null;
        setError(message);
        setFacturas([]);
      }
    },
    [currentRole?.factoringId, meta.page, meta.limit],
  );

  useEffect(() => {
    fetchFacturas(sortBy, order);
  }, [currentRole?.factoringId, meta.page, meta.limit]);

  const updateSearchParams = (
    currentSortBy: string,
    currentOrder: string,
    page?: number,
    limit?: number,
  ) => {
    const newSearchParams = new URLSearchParams();
    const currentPage = page ?? meta.page;
    const currentLimit = limit ?? meta.limit;
    if (currentPage !== 1) newSearchParams.set("page", String(currentPage));
    if (currentLimit !== 10) newSearchParams.set("limit", String(currentLimit));
    if (currentSortBy) newSearchParams.set("sortBy", currentSortBy);
    if (currentOrder) newSearchParams.set("order", currentOrder);
    setSearchParams(newSearchParams);
  };

  const handleSort = (field: string) => {
    let newOrder: string;
    let newSortBy: string;

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
    updateSearchParams(newSortBy, newOrder, meta.page, meta.limit);
    fetchFacturas(newSortBy, newOrder);
  };

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

  const getOfertaStatus = (factura: Factura) => {
    const estado = factura.factoringIsOfertme?.toLowerCase() || "";

    switch (estado) {
      case "aceptada":
        return {
          label: "Aceptada",
          color: "var(--color-fg-success-primary)",
          bg: "var(--color-bg-success-secondary)",
        };
      case "rechazada":
        return {
          label: "Rechazada",
          color: "var(--color-fg-danger-primary)",
          bg: "var(--color-bg-danger-secondary)",
        };
      case "expirada":
        return {
          label: "Expirada",
          color: "var(--color-fg-warning-primary)",
          bg: "var(--color-bg-warning-secondary)",
        };
      case "activa":
        return {
          label: "Activa",
          color: "var(--color-fg-accent-primary)",
          bg: "var(--color-bg-accent-secondary)",
        };
      default:
        return {
          label: estado,
          color: "var(--color-fg-accent-primary)",
          bg: "var(--color-bg-accent-secondary)",
        };
    }
  };

  return (
    <Layout>
      <Box sx={appContentSx}>
        {/* Header Section */}
        <Box
          sx={[
            pageHeaderSx,
            {
              backgroundColor: "var(--color-bg-default-primary)",
              borderRadius: 3,
              p: 3,
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Storefront sx={{ color: "var(--color-fg-default-secondary)", fontSize: 28 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontFamily: "var(--font-heading)", color: "var(--color-fg-default-primary)" }}
              >
                Marketplace
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                Explora las facturas disponibles para financiamiento y envía tus
                ofertas.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Facturas count */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            {meta.total} facturas disponibles
          </Typography>
        </Box>

        {/* Table */}
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
          ) : facturas.length === 0 || error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <Storefront sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)", mb: 2 }} />
              <Typography
                variant="h6"
                sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}
              >
                {error || "No hay facturas disponibles en el marketplace"}
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--color-fg-default-tertiary)", mt: 1 }}>
                Las facturas publicadas por empresas aparecerán aquí
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={tableScrollSx}>
              <Table sx={tableWideSx}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}>
                    {MARKETPLACE_SORTABLE_COLUMNS.map((column) => (
                      <SortableTableHeader
                        key={column.field}
                        field={column.field}
                        label={column.label}
                        currentSortBy={sortBy}
                        currentOrder={order}
                        onSort={handleSort}
                      />
                    ))}
                    <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                      Mi Oferta
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturas.map((factura) => {
                    const status = getOfertaStatus(factura);
                    return (
                      <TableRow
                        key={factura.id}
                        sx={{
                          "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, color: "var(--color-fg-default-primary)" }}
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
                              sx={{ fontWeight: 500, color: "var(--color-fg-default-primary)" }}
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
                            sx={{ color: "var(--color-fg-accent-primary)", fontWeight: 600 }}
                          >
                            {factura.folio}
                          </Typography>
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
                          {factura.factoringIsOfertme ? (
                            <Chip
                              label={status?.label || "N/A"}
                              size="small"
                              sx={{
                                backgroundColor: status?.bg || "var(--color-bg-accent-secondary)",
                                color: status?.color || "var(--color-fg-accent-primary)",
                                fontWeight: 500,
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
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setMenuFactura(factura);
                            }}
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

              {/* Pagination */}
              {meta.lastPage > 1 && (
                <Box
                  sx={[
                    toolbarRowSx,
                    { borderTop: "1px solid var(--color-border-default-primary)" },
                  ]}
                >
                  <FormControl size="small" sx={paginationSelectSx}>
                    <InputLabel id="marketplace-limit-label">
                      Filas por página
                    </InputLabel>
                    <Select
                      labelId="marketplace-limit-label"
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
          onClose={() => {
            setAnchorEl(null);
            setMenuFactura(null);
          }}
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
          <MenuItem
            onClick={() => {
              if (menuFactura) navigate(`/facturas/${menuFactura.id}/factoring`);
              setAnchorEl(null);
              setMenuFactura(null);
            }}
          >
            <ListItemIcon>
              <Visibility sx={{ color: "var(--color-fg-default-secondary)" }} />
            </ListItemIcon>
            <ListItemText primary="Ver factura" />
          </MenuItem>
        </Menu>
      </Box>
    </Layout>
  );
};

export default Marketplace;
