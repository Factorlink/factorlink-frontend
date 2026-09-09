import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Send, Delete, Settings, Visibility } from "@mui/icons-material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import type { Factura } from "../../types/factura";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import DeleteFacturaModal from "../Modals/DeleteFacturaModal";
import RemoveMarketplaceModal from "../Modals/RemoveMarketplaceModal";
import DocumentsRequiredModal from "../Modals/DocumentsRequiredModal";
import OfertasDrawer from "./OfertasDrawer";
import FacturaDetalleInformacion, {
  FacturaDetalleDocumentos,
} from "./FacturaDetalleInformacion";

export type FacturaDetallePanelProps = {
  factura: Factura;
  onFacturaChange: (factura: Factura) => void;
  onDeleted?: () => void;
  onMarketplaceChange?: () => void;
  variant?: "page" | "drawer";
  openOfertas?: boolean;
  initialOfertaId?: string | null;
  onOfertasOpenChange?: (open: boolean) => void;
};

const FacturaDetallePanel = ({
  factura,
  onFacturaChange,
  onDeleted,
  onMarketplaceChange,
  variant = "page",
  openOfertas = false,
  initialOfertaId = null,
  onOfertasOpenChange,
}: FacturaDetallePanelProps) => {
  const navigate = useNavigate();
  const { currentRole } = useAuthStore();
  const { refreshFactura } = useFacturas();
  const isPage = variant === "page";

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeMarketplaceModalOpen, setRemoveMarketplaceModalOpen] =
    useState(false);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] =
    useState(false);
  const [manualOfertasOpen, setManualOfertasOpen] = useState(false);

  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const isInMarketplace = ["EN_MARKETPLACE", "CON_OFERTAS"].includes(
    factura.estado,
  );
  const ofertasDrawerOpen =
    isPage && !isCargada && (manualOfertasOpen || openOfertas);

  const handleOpenOfertas = () => {
    setManualOfertasOpen(true);
    onOfertasOpenChange?.(true);
  };

  const handleCloseOfertas = () => {
    setManualOfertasOpen(false);
    onOfertasOpenChange?.(false);
  };

  const handleEnviarCotizar = () => {
    if (currentRole && currentRole.nivel >= 3) {
      navigate(`/facturas/${factura.id}/cotizar`);
    } else {
      setDocumentsRequiredModalOpen(true);
    }
  };

  const refreshCurrentFactura = async () => {
    const data = await refreshFactura(factura.id);
    onFacturaChange(data);
    return data;
  };

  const handleRemoveMarketplaceSuccess = async () => {
    try {
      await refreshCurrentFactura();
      onMarketplaceChange?.();
    } catch (err) {
      console.error("Error refreshing factura after remove:", err);
    }
  };

  const handleOfertasActualizadas = async () => {
    try {
      await refreshCurrentFactura();
      onMarketplaceChange?.();
    } catch (err) {
      console.error("Error refreshing factura after ofertas:", err);
    }
  };

  if (!isPage) {
    return (
      <FacturaDetalleInformacion
        factura={factura}
        onFacturaChange={onFacturaChange}
        dense
        includeDocumentos
      />
    );
  }

  return (
    <>
      <FacturaDetalleInformacion
        factura={factura}
        onFacturaChange={onFacturaChange}
        includeDocumentos={false}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: { xs: 2, md: 3 },
          gridAutoRows: "auto",
          alignItems: "start",
        }}
      >
        <FacturaDetalleDocumentos
          factura={factura}
          onFacturaChange={onFacturaChange}
        />

        <Box
          sx={{
            gridColumn: { md: "2" },
            backgroundColor: "var(--color-bg-default-primary)",
            borderRadius: 3,
            p: 3,
            boxShadow: "var(--shadow-popover)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-tertiary)",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Settings
                sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Acciones
              </Typography>
              <Typography variant="body2">Gestiona esta factura</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {!isCargada && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Visibility />}
                onClick={handleOpenOfertas}
                sx={{
                  borderColor: "var(--color-border-accent-primary)",
                  color: "var(--color-fg-accent-primary)",
                  "&:hover": {
                    borderColor: "var(--color-border-accent-secondary)",
                    backgroundColor: "var(--color-bg-accent-secondary)",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                Ver ofertas
              </Button>
            )}
            {isCargada && (
              <Button
                variant="contained"
                fullWidth
                startIcon={<Send />}
                onClick={handleEnviarCotizar}
                sx={{
                  backgroundColor: "var(--color-bg-accent-primary)",
                  "&:hover": {
                    backgroundColor: "var(--color-bg-accent-primary-hover)",
                  },
                  "&:disabled": { opacity: 0.7 },
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  color: "var(--color-fg-on-accent-primary)",
                }}
              >
                Enviar a cotizar
              </Button>
            )}
            {isInMarketplace && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<StorefrontIcon />}
                onClick={() => setRemoveMarketplaceModalOpen(true)}
                sx={{
                  borderColor: "var(--color-border-danger-primary)",
                  color: "var(--color-fg-danger-primary)",
                  "&:hover": {
                    borderColor: "var(--color-border-danger-secondary)",
                    backgroundColor: "var(--color-bg-danger-secondary)",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                Quitar del marketplace
              </Button>
            )}
            {isCargada && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Delete />}
                onClick={() => setDeleteModalOpen(true)}
                sx={{
                  borderColor: "var(--color-border-danger-primary)",
                  color: "var(--color-fg-danger-primary)",
                  "&:hover": {
                    borderColor: "var(--color-border-danger-secondary)",
                    backgroundColor: "var(--color-bg-danger-secondary)",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                }}
              >
                Eliminar factura
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <DeleteFacturaModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => onDeleted?.()}
        facturaData={{
          id: factura.id,
          folio: factura.folio,
          razonSocialReceptor: factura.razonSocialReceptor || "N/A",
          montoTotal: factura.montoTotal,
        }}
      />

      <RemoveMarketplaceModal
        open={removeMarketplaceModalOpen}
        onClose={() => setRemoveMarketplaceModalOpen(false)}
        onSuccess={() => {
          void handleRemoveMarketplaceSuccess();
        }}
        facturaData={{
          id: factura.id,
          folio: factura.folio,
          razonSocialReceptor: factura.razonSocialReceptor || "N/A",
        }}
      />

      <DocumentsRequiredModal
        open={documentsRequiredModalOpen}
        onClose={() => setDocumentsRequiredModalOpen(false)}
      />

      <OfertasDrawer
        open={ofertasDrawerOpen}
        onClose={handleCloseOfertas}
        factura={factura}
        initialOfertaId={initialOfertaId}
        onOfertasActualizadas={() => {
          void handleOfertasActualizadas();
        }}
      />
    </>
  );
};

export default FacturaDetallePanel;
