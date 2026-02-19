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
import { useFacturas } from "../../hooks/useFacturas";

import type { Factura } from "../../types/factura";
import type { Meta } from "../../types/meta";
import type { SelectChangeEvent } from "@mui/material/Select";
import OfertasDrawer from "./OfertasDrawer";

interface OfertasFacturasTableProps {
  empresaId: string;
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

const OfertasFacturasTable = ({ empresaId }: OfertasFacturasTableProps) => {
  const { getFacturasConOfertasByEmpresaId, loading } = useFacturas();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: 10,
    page: 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
  });

  const fetchData = useCallback(async () => {
    if (!empresaId) return;
    try {
      const response = await getFacturasConOfertasByEmpresaId({
        page: meta.page,
        limit: meta.limit,
        empresaId,
      });
      setFacturas(response?.data || []);
      if (response?.meta) setMeta(response.meta);
    } catch {
      setFacturas([]);
    }
  }, [empresaId, meta.page, meta.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setMeta((prev) => ({ ...prev, page: value }));
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    setMeta((prev) => ({ ...prev, limit: Number(event.target.value), page: 1 }));
  };

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
          <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 500 }}>
            No hay facturas con ofertas
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
            Las facturas que reciban ofertas aparecerán aquí
          </Typography>
        </Box>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Folio</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Receptor</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Fecha Emisión</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Monto Total</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Monto a Financiar</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Plazo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Ofertas Recibidas</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.map((factura) => (
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
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
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
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Groups sx={{ fontSize: 18, color: "#64748B" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "#1E293B", fontWeight: 500 }}
                      >
                        {getOfertasCount(factura)}
                      </Typography>
                    </Box>
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
              ))}
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
                    color: "white",
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
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleVerOfertas}>
          <ListItemIcon>
            <Visibility sx={{ color: "#64748B" }} />
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
