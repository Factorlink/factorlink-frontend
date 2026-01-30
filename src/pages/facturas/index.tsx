import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Description,
  Search,
  Sync,
  Add,
  Storefront,
  CheckCircle,
  MoreVert,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";

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
    case "COTIZADA":
      return {
        label: "COTIZADA",
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

const Facturas = () => {
  const { currentRole } = useAuthStore();
  const { loading, getFacturas } = useFacturas();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: 10,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchFacturas = async () => {
      if (currentRole?.empresaId) {
        const { data, meta: metaResponse } = await getFacturas({
          page: meta.page,
          limit: meta.limit,
          empresaId: currentRole.empresaId,
        });
        setFacturas(data || []);
        setMeta(metaResponse);
      }
    };

    fetchFacturas();
  }, [currentRole?.empresaId, meta.page, meta.limit]);

  const filteredFacturas = useMemo(() => {
    if (!searchTerm) return facturas;
    const term = searchTerm.toLowerCase();
    return facturas.filter(
      (f) =>
        f.folio?.toLowerCase().includes(term) ||
        f.razonSocialReceptor?.toLowerCase().includes(term) ||
        f.rutReceptor?.toLowerCase().includes(term)
    );
  }, [facturas, searchTerm]);

  const stats = useMemo(() => {
    const total = meta.total || 0;
    const cargadas = facturas.filter(
      (f) => f.estado === "CARGADA"
    ).length;
    const enMarketplace = facturas.filter(
      (f) => f.estado === "EN_MARKETPLACE"
    ).length;
    const cotizadas = facturas.filter(
      (f) => f.estado === "COTIZADA"
    ).length;
    return { total, cargadas, enMarketplace, cotizadas };
  }, [facturas]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };
  
  const handleLimitChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    setMeta((prev) => ({ ...prev, limit: value, page: 1 }));
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
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
              sx={{
                backgroundColor: "#475569",
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
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                backgroundColor: "#00BCD4",
                "&:hover": { backgroundColor: "#00ACC1" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                color: "white",
              }}
            >
              Agregar desde SII
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
              {stats.total}
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
              {stats.cargadas}
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
              {stats.enMarketplace}
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
              Cotizadas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#00A86B" }}>
              {stats.cotizadas}
            </Typography>
          </Box>
        </Box>

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Buscar por folio, receptor o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", md: 400 },
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />
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
          ) : filteredFacturas.length === 0 ? (
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
                {searchTerm
                  ? "No se encontraron facturas con los criterios de búsqueda"
                  : "Sincroniza con el SII o agrega facturas manualmente para comenzar"}
              </Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Folio
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Receptor
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Fecha Emisión
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Monto Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Monto a Financiar
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Plazo
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFacturas.map((factura) => {
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
                            #F-{factura.folio}
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
                          <IconButton size="small" sx={{ color: "#64748B" }}>
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

export default Facturas;
