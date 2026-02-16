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
  Button,
} from "@mui/material";
import { Storefront, Visibility } from "@mui/icons-material";
import SortableTableHeader from "../../components/Facturas/SortableTableHeader";
import Layout from "../../components/Layout";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";

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

  const [meta, setMeta] = useState<Meta>(() => ({
    lastPage: 1,
    limit: Number(searchParams.get("limit")) || 10,
    page: Number(searchParams.get("page")) || 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
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
        const { data, meta: metaResponse } = await getFacturasByFactoringId(params as any);
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

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setMeta((prev) => ({ ...prev, page: value }));
    updateSearchParams(sortBy, order, value, meta.limit);
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    setMeta((prev) => ({ ...prev, limit: value, page: 1 }));
    updateSearchParams(sortBy, order, 1, value);
  };

  const getMiOferta = (factura: Factura) => {
    return (factura as any).miOferta ?? null;
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
              <Storefront sx={{ color: "#64748B", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
                Marketplace
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Explora las facturas disponibles para financiamiento y envía tus ofertas.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Facturas count */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            {meta.total} facturas disponibles
          </Typography>
        </Box>

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
              <Storefront sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 500 }}>
                {error || "No hay facturas disponibles en el marketplace"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
                Las facturas publicadas por empresas aparecerán aquí
              </Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
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
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Ofertas
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Mi Oferta
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturas.map((factura) => {
                    const miOferta = getMiOferta(factura);
                    return (
                      <TableRow
                        key={factura.id}
                        sx={{
                          "&:hover": { backgroundColor: "#F8FAFC" },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                              {factura.razonSocialEmisor || "N/A"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748B" }}>
                              {factura.rutEmisor || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                              {factura.razonSocialReceptor || "N/A"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748B" }}>
                              {factura.rutReceptor || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#00BCD4", fontWeight: 600 }}>
                            #{factura.folio}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748B" }}>
                            {formatDate(factura.fechaEmision)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#1E293B", fontWeight: 500 }}>
                            {formatCurrency(factura.montoTotal)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#1E293B", fontWeight: 500 }}>
                            {factura.numeroOfertasRecibidas || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {miOferta ? (
                            <Chip
                              label="Enviada"
                              size="small"
                              sx={{
                                backgroundColor: "rgba(0, 188, 212, 0.1)",
                                color: "#00BCD4",
                                fontWeight: 500,
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Visibility sx={{ fontSize: 16 }} />}
                            onClick={() => navigate(`/facturas/${factura.id}/factoring`)}
                            sx={{
                              textTransform: "none",
                              color: "#00BCD4",
                              fontWeight: 500,
                              fontSize: "0.8125rem",
                              "&:hover": { backgroundColor: "rgba(0, 188, 212, 0.08)" },
                            }}
                          >
                            Ver factura
                          </Button>
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
                    <InputLabel id="marketplace-limit-label">Filas por página</InputLabel>
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
                        color: "white",
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default Marketplace;
