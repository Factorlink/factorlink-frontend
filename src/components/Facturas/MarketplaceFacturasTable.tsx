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
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Storefront,
  Visibility,
  Groups,
  MoreVert,
  Delete,
} from "@mui/icons-material";
import { useFacturas } from "../../hooks/useFacturas";
import { useSearchParams } from "react-router-dom";
import type { Factura } from "../../types/factura";
import RemoveMarketplaceModal from "../Modals/RemoveMarketplaceModal";
import OfertasDrawer from "./OfertasDrawer";
import SortableTableHeader from "./SortableTableHeader";
import {
  tableShellSx,
  tableScrollSx,
  tableWideSx,
} from "../../theme/layoutStyles";

interface MarketplaceFacturasTableProps {
  empresaId: string;
  onRemoveSuccess?: () => void;
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

const MarketplaceFacturasTable = ({
  empresaId,
  onRemoveSuccess,
  onMetaChange,
}: MarketplaceFacturasTableProps) => {
  const { listFromMarketplace, loading } = useFacturas();
  const [searchParams, setSearchParams] = useSearchParams();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [order, setOrder] = useState(searchParams.get("order") || "DESC");

  const updateSearchParams = (newSortBy: string, newOrder: string) => {
    const params = new URLSearchParams();
    if (newSortBy) params.set("sortBy", newSortBy);
    if (newSortBy && newOrder) params.set("order", newOrder);
    setSearchParams(params);
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

  const fetchMarketplace = useCallback(async () => {
    if (!empresaId) return;
    try {
      const response = await listFromMarketplace({
        page: 1,
        limit: 10,
        empresaId,
        sortBy: sortBy || undefined,
        order: sortBy ? order : undefined,
      });
      setFacturas(response?.data || response || []);
      if (response?.meta) onMetaChange?.(response.meta);
    } catch {
      setFacturas([]);
    }
  }, [empresaId, sortBy, order]);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

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

  const handleVerOfertas = () => {
    if (selectedFactura && (selectedFactura.numeroOfertasRecibidas ?? 0) > 0) {
      setDrawerOpen(true);
    }
    setAnchorEl(null);
  };

  const handleOpenRemoveModal = () => {
    // selectedFactura is already set by handleMenuOpen
    setRemoveModalOpen(true);
    setAnchorEl(null);
  };

  const handleRemoveSuccess = () => {
    fetchMarketplace();
    onRemoveSuccess?.();
  };

  return (
    <>
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
            <Storefront sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}>
              No hay facturas en marketplace
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-tertiary)", mt: 1 }}>
              Las facturas enviadas a cotizar aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <Box sx={tableScrollSx}>
          <Table sx={tableWideSx}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}>
                <SortableTableHeader field="folio" label="Folio" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="razonSocialReceptor" label="Receptor" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="fechaEmision" label="Fecha Emisión" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="montoFinanciar" label="Monto a Financiar" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <SortableTableHeader field="plazo" label="Plazo" currentSortBy={sortBy} currentOrder={order} onSort={handleSort} />
                <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                  Ofertas
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                  Acciones
                </TableCell>
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
                        {factura.numeroOfertasRecibidas || 0}
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
        <MenuItem onClick={handleOpenRemoveModal}>
          <ListItemIcon>
            <Delete sx={{ color: "var(--color-fg-danger-primary)" }} />
          </ListItemIcon>
          <ListItemText
            primary="Quitar del marketplace"
            sx={{ "& .MuiTypography-root": { color: "var(--color-fg-danger-primary)" } }}
          />
        </MenuItem>
      </Menu>

      {selectedFactura && (
        <RemoveMarketplaceModal
          open={removeModalOpen}
          onClose={() => {
            setRemoveModalOpen(false);
            // Don't clear selectedFactura here if we want to be safe, 
            // but usually modal close implies we are done with it or cancelled.
            // The original code cleared it. I will keep it consistent.
            setSelectedFactura(null); 
          }}
          onSuccess={handleRemoveSuccess}
          facturaData={{
            id: selectedFactura.id,
            folio: selectedFactura.folio,
            razonSocialReceptor: selectedFactura.razonSocialReceptor || "N/A",
          }}
      />
    )}
      <OfertasDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        factura={selectedFactura}
      />
    </>
  );
};

export default MarketplaceFacturasTable;
