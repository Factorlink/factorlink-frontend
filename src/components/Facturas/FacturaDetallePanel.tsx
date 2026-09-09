import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import {
  Send,
  Delete,
  Settings,
  Visibility,
} from "@mui/icons-material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import type { Factura, FacturaArchivo } from "../../types/factura";
import { useFacturas } from "../../hooks/useFacturas";
import useAuthStore from "../../store/authStore";
import UploadXmlModal from "../Modals/UploadXmlModal";
import DeleteFacturaModal from "../Modals/DeleteFacturaModal";
import RemoveMarketplaceModal from "../Modals/RemoveMarketplaceModal";
import DocumentsRequiredModal from "../Modals/DocumentsRequiredModal";
import FactoringsList from "./FactoringsList";
import OfertasDrawer from "./OfertasDrawer";
import FacturaResumenCard from "./FacturaResumenCard";
import DetalleCotizacionCard from "./DetalleCotizacionCard";
import DocumentosAsociadosCard from "./DocumentosAsociadosCard";
import { isXmlUiEnabled } from "../../config/featureFlags";

const downloadBase64File = (
  base64: string,
  fileName: string,
  mimeType: string,
) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export type FacturaDetallePanelProps = {
  factura: Factura;
  onFacturaChange: (factura: Factura) => void;
  onDeleted?: () => void;
  onMarketplaceChange?: () => void;
  variant?: "page" | "drawer";
  /** Deep-link support from /facturas/:id */
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
  const { refreshFactura, uploadFacturaArchivo, deleteFacturaArchivo } =
    useFacturas();

  const [uploadXmlModalOpen, setUploadXmlModalOpen] = useState(false);
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
  const showXmlUi = isXmlUiEnabled();
  const dense = variant === "drawer";
  const ofertasDrawerOpen =
    !isCargada && (manualOfertasOpen || openOfertas);

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

  const handleUploadXmlSuccess = async () => {
    try {
      await refreshCurrentFactura();
    } catch (err) {
      console.error("Error refreshing factura:", err);
    }
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

  const cardPadding = dense ? 2 : 3;
  const cardMb = dense ? 2 : 3;

  return (
    <>
      <FacturaResumenCard
        factura={factura}
        showSolicitudFields={!isCargada}
      />

      {factura.estado !== "CARGADA" && (
        <DetalleCotizacionCard
          plazo={factura.plazo}
          porcentajeFinanciamiento={factura.porcentajeFinanciamiento || "0"}
          montoFinanciar={factura.montoFinanciar}
        />
      )}

      {isInMarketplace && (
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-primary)",
            borderRadius: 3,
            p: cardPadding,
            mb: cardMb,
            boxShadow: "var(--shadow-popover)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
              <Visibility
                sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-fg-default-primary)",
                }}
              >
                Visibilidad en Marketplace
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Factorings que pueden ver esta factura
              </Typography>
            </Box>
          </Box>

          {factura.visibilidad === "TODOS" ? (
            <Box
              sx={{
                backgroundColor: "var(--color-bg-success-secondary)",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Visibility
                sx={{ color: "var(--color-fg-success-primary)", fontSize: 20 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-success-primary)", fontWeight: 500 }}
              >
                Esta factura es visible para todos los factorings registrados en
                la plataforma.
              </Typography>
            </Box>
          ) : (
            <FactoringsList
              factorings={factura.visibilidadDetalle?.factorings || []}
            />
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: dense ? "1fr" : "2fr 1fr",
          },
          gap: { xs: 2, md: dense ? 2 : 3 },
          gridAutoRows: "auto",
          alignItems: "start",
        }}
      >
        <DocumentosAsociadosCard
          factura={factura}
          adjuntos={factura.archivos ?? []}
          onAdjuntosChange={(files) =>
            onFacturaChange({ ...factura, archivos: files })
          }
          onUploadAdjunto={async (payload) => {
            const uploaded = await uploadFacturaArchivo(factura.id, payload);
            if (uploaded?.id) return uploaded;
            const refreshed = await refreshFactura(factura.id);
            const match = (refreshed.archivos ?? []).find(
              (archivo: FacturaArchivo) =>
                archivo.nombreArchivo === payload.nombreArchivo,
            );
            if (!match) {
              throw new Error("No se pudo confirmar el archivo subido");
            }
            return match;
          }}
          onDeleteAdjunto={(archivoId) =>
            deleteFacturaArchivo(factura.id, archivoId)
          }
          onDownloadPdf={(base64, fileName) =>
            downloadBase64File(base64, fileName, "application/pdf")
          }
          {...(showXmlUi
            ? {
                onUploadXmlClick: () => setUploadXmlModalOpen(true),
                onDownloadXml: (base64: string, fileName: string) =>
                  downloadBase64File(base64, fileName, "application/xml"),
              }
            : {})}
        />

        <Box
          sx={{
            gridColumn: { md: dense ? "auto" : "2" },
            backgroundColor: "var(--color-bg-default-primary)",
            borderRadius: 3,
            p: cardPadding,
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

      {showXmlUi && (
        <UploadXmlModal
          open={uploadXmlModalOpen}
          onClose={() => setUploadXmlModalOpen(false)}
          onSuccess={handleUploadXmlSuccess}
          facturaId={factura.id}
        />
      )}

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
        elevated={variant === "drawer"}
      />
    </>
  );
};

export default FacturaDetallePanel;
