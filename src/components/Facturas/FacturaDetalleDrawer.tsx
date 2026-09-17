import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { Close, Description, ErrorOutline } from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import { useFacturas } from "../../hooks/useFacturas";
import { getFacturaStatusConfig } from "../../theme";
import FacturaDetalleTabs, {
  type FacturaDetalleTab,
} from "./FacturaDetalleTabs";

export type FacturaDetalleDrawerProps = {
  open: boolean;
  onClose: () => void;
  facturaId: string | null;
  onDeleted?: () => void;
  onFacturaUpdated?: () => void;
  initialTab?: FacturaDetalleTab | null;
  ofertaId?: string | null;
  onTabChange?: (tab: FacturaDetalleTab) => void;
};

const FacturaDetalleDrawer = ({
  open,
  onClose,
  facturaId,
  onFacturaUpdated,
  initialTab = null,
  ofertaId = null,
  onTabChange,
}: FacturaDetalleDrawerProps) => {
  const { getFacturaById } = useFacturas();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<FacturaDetalleTab>(
    initialTab || "informacion",
  );
  const [tabsKey, setTabsKey] = useState(0);

  const loadFactura = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFacturaById(id);
      setFactura(data);
    } catch (err) {
      console.error("Error loading factura in drawer:", err);
      setFactura(null);
      setError("No se pudo cargar la factura. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !facturaId) {
      setFactura(null);
      setError(null);
      setLoading(false);
      return;
    }
    void loadFactura(facturaId);
  }, [open, facturaId, loadFactura]);

  useEffect(() => {
    if (!open) return;
    setTab(initialTab || "informacion");
  }, [open, facturaId, initialTab]);

  const statusConfig = getFacturaStatusConfig(factura?.estado || "");

  const handleFacturaChange = (next: Factura) => {
    setFactura(next);
  };

  const handleTabChange = (next: FacturaDetalleTab) => {
    setTab(next);
    onTabChange?.(next);
  };

  const handleOfertasActualizadas = () => {
    onFacturaUpdated?.();
    if (facturaId) {
      void loadFactura(facturaId);
      setTabsKey((k) => k + 1);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "75%", lg: "65%" },
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {factura?.folio
              ? `Detalle de la factura #${factura.folio}`
              : "Detalle de la factura"}
          </Typography>
          {factura?.razonSocialReceptor && (
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              {factura.razonSocialReceptor}
            </Typography>
          )}
          {factura?.estado && (
            <Chip
              icon={statusConfig.icon as React.ReactElement}
              label={statusConfig.label}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 500,
                "& .MuiChip-icon": { color: statusConfig.color },
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small">
          <Close />
        </IconButton>
      </Box>

      {loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "var(--color-fg-accent-primary)" }} />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Cargando factura...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
            textAlign: "center",
          }}
        >
          <ErrorOutline
            sx={{ fontSize: 48, color: "var(--color-fg-danger-primary)" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            {error}
          </Typography>
          {facturaId && (
            <Button
              variant="contained"
              onClick={() => void loadFactura(facturaId)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "var(--color-fg-on-accent-primary)",
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-accent-primary-hover)",
                },
              }}
            >
              Reintentar
            </Button>
          )}
        </Box>
      )}

      {!loading && !error && !factura && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 1,
          }}
        >
          <Description
            sx={{ fontSize: 48, color: "var(--color-fg-default-tertiary)" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Factura no encontrada
          </Typography>
        </Box>
      )}

      {!loading && !error && factura && (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <FacturaDetalleTabs
            key={`${factura.id}-${tabsKey}`}
            factura={factura}
            onFacturaChange={handleFacturaChange}
            activeTab={tab}
            onTabChange={handleTabChange}
            initialOfertaId={ofertaId}
            onOfertasActualizadas={handleOfertasActualizadas}
            enabled={open}
            dense
            includeDocumentos
            comentariosSelectLabelId="drawer-oferta-comentarios-label"
          />
        </Box>
      )}
    </Drawer>
  );
};

export default FacturaDetalleDrawer;
