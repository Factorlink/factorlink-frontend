import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Description,
  Send,
  Delete,
  Settings,
  ErrorOutline,
  ArrowBack,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../components/Layout";
import type { Factura } from "../../../types/factura";
import { useFacturas } from "../../../hooks/useFacturas";
import UploadXmlModal from "../../../components/Modals/UploadXmlModal";
import UploadPdfModal from "../../../components/Modals/UploadPdfModal";
import DeleteFacturaModal from "../../../components/Modals/DeleteFacturaModal";
import RemoveMarketplaceModal from "../../../components/Modals/RemoveMarketplaceModal";
import DocumentsRequiredModal from "../../../components/Modals/DocumentsRequiredModal";
import StorefrontIcon from "@mui/icons-material/Storefront";
import useAuthStore from "../../../store/authStore";
import FactoringsList from "../../../components/Facturas/FactoringsList";
import OfertasDrawer from "../../../components/Facturas/OfertasDrawer";
import { appContentSx } from "../../../theme/layoutStyles";
import FacturaResumenCard from "../../../components/Facturas/FacturaResumenCard";
import DetalleCotizacionCard from "../../../components/Facturas/DetalleCotizacionCard";
import DocumentosAsociadosCard from "../../../components/Facturas/DocumentosAsociadosCard";

const FacturaDetail = () => {
  const { getFacturaById, loading, refreshFactura } = useFacturas();
  const { currentRole } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const ofertaIdParam = searchParams.get("ofertaId");
  const shouldOpenOfertas =
    searchParams.get("ofertas") === "true" || Boolean(ofertaIdParam);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadXmlModalOpen, setUploadXmlModalOpen] = useState(false);
  const [uploadPdfModalOpen, setUploadPdfModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeMarketplaceModalOpen, setRemoveMarketplaceModalOpen] =
    useState(false);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] =
    useState(false);
  const [ofertasDrawerOpen, setOfertasDrawerOpen] = useState(shouldOpenOfertas);

  const fetchFactura = async () => {
    try {
      setError(null);
      const data = await getFacturaById(id!);
      setFactura(data);
    } catch (err) {
      console.error("Error fetching factura:", err);
      setError("No se pudo cargar la factura. Por favor, intente nuevamente.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchFactura();
    }
  }, [id]);

  useEffect(() => {
    if (!factura) return;

    if (factura.estado?.toLowerCase() === "cargada") {
      setOfertasDrawerOpen(false);
      if (!searchParams.has("ofertas") && !searchParams.has("ofertaId")) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("ofertas");
          next.delete("ofertaId");
          return next;
        },
        { replace: true },
      );
      return;
    }

    if (shouldOpenOfertas) {
      setOfertasDrawerOpen(true);
    }
  }, [factura, shouldOpenOfertas]);

  const handleBack = () => {
    navigate("/facturas");
  };

  const handleOpenOfertas = () => {
    setOfertasDrawerOpen(true);
    if (searchParams.get("ofertas") === "true") return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("ofertas", "true");
        return next;
      },
      { replace: true },
    );
  };

  const handleCloseOfertas = () => {
    setOfertasDrawerOpen(false);
    if (!searchParams.has("ofertas") && !searchParams.has("ofertaId")) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("ofertas");
        next.delete("ofertaId");
        return next;
      },
      { replace: true },
    );
  };

  const handleEnviarCotizar = () => {
    if (currentRole && currentRole.nivel >= 3) {
      navigate(`/facturas/${id}/cotizar`);
    } else {
      setDocumentsRequiredModalOpen(true);
    }
  };

  const handleEliminar = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    navigate("/facturas");
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleCloseUploadXmlModal = () => {
    setUploadXmlModalOpen(false);
  };

  const handleCloseUploadPdfModal = () => {
    setUploadPdfModalOpen(false);
  };

  const handleUploadPdfSuccess = async () => {
    try {
      const data = await refreshFactura(id!);
      setFactura(data);
    } catch (err) {
      console.error("Error refreshing factura:", err);
      setError(
        "No se pudo actualizar la factura. Por favor, intente nuevamente.",
      );
    }
  };

  const handleUploadXmlSuccess = async () => {
    try {
      const data = await refreshFactura(id!);
      setFactura(data);
    } catch (err) {
      console.error("Error refreshing factura:", err);
      setError(
        "No se pudo actualizar la factura. Por favor, intente nuevamente.",
      );
    }
  };

  const handleDescargarXML = (base64: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "var(--color-fg-accent-primary)" }} />
          <Typography variant="body1" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Cargando factura...
          </Typography>
        </Box>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <IconButton onClick={handleBack} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              gap: 2,
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)" }} />
            <Typography variant="h6" sx={{ color: "var(--color-fg-default-primary)", fontWeight: 500, fontFamily: "var(--font-heading)" }}>
              Error al cargar la factura
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                mt: 2,
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                textTransform: "none",
                color: "var(--color-fg-on-accent-primary)",
              }}
            >
              Reintentar
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (!factura) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <IconButton onClick={handleBack} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              gap: 2,
            }}
          >
            <Description sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)" }} />
            <Typography variant="h6" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Factura no encontrada
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const isInMarketplace = ["EN_MARKETPLACE", "CON_OFERTAS"].includes(
    factura.estado,
  );

  return (
    <Layout>
      <Box sx={appContentSx}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
              "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
            }}
          >
            Volver a facturas
          </Button>
        </Box>

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

        {/* Card: Visibilidad en Marketplace */}
        {(factura.visibilidad === "TODOS" ||
          factura.visibilidad === "SELECCIONADOS") && (
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-primary)",
              borderRadius: 3,
              p: 3,
              mb: 3,
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
                <Visibility sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, fontFamily: "var(--font-heading)", color: "var(--color-fg-default-primary)" }}
                >
                  Visibilidad en Marketplace
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
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
                <Visibility sx={{ color: "var(--color-fg-success-primary)", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-success-primary)", fontWeight: 500 }}
                >
                  Esta factura es visible para todos los factorings registrados
                  en la plataforma.
                </Typography>
              </Box>
            ) : (
              <FactoringsList
                factorings={factura.visibilidadDetalle?.factorings || []}
              />
            )}
          </Box>
        )}

        {/* Documentos + Acciones */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: { xs: 2, md: 3 },
            gridAutoRows: "auto", // allow each row to size itself
            alignItems: "start",  // prevent stretching children to full row height
          }}
        >
          {/* Documentos Asociados */}
          <DocumentosAsociadosCard
            factura={factura}
            onUploadXmlClick={() => setUploadXmlModalOpen(true)}
            onUploadPdfClick={() => setUploadPdfModalOpen(true)}
            onDownloadXml={handleDescargarXML}
            onDownloadPdf={(base64, fileName) => {
              const byteCharacters = atob(base64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "application/pdf" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            onFetchSiiSuccess={(data) => setFactura(data)}
          />

          {/* Acciones */}
          <Box
            sx={{
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
                <Settings sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Acciones
                </Typography>
                <Typography variant="body2">Gestiona esta factura</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {factura.estado?.toLowerCase() !== "cargada" && (
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
                    "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
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
                  onClick={handleEliminar}
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

        {/* Upload XML Modal */}
        <UploadXmlModal
          open={uploadXmlModalOpen}
          onClose={handleCloseUploadXmlModal}
          onSuccess={handleUploadXmlSuccess}
          facturaId={id || ""}
        />

        {/* Upload PDF Modal */}
        <UploadPdfModal
          open={uploadPdfModalOpen}
          onClose={handleCloseUploadPdfModal}
          onSuccess={handleUploadPdfSuccess}
          facturaId={id || ""}
        />

        {/* Delete Factura Modal */}
        {factura && (
          <DeleteFacturaModal
            open={deleteModalOpen}
            onClose={handleCloseDeleteModal}
            onSuccess={handleDeleteSuccess}
            facturaData={{
              id: factura.id,
              folio: factura.folio,
              razonSocialReceptor: factura.razonSocialReceptor || "N/A",
              montoTotal: factura.montoTotal,
            }}
          />
        )}

        {/* Remove from Marketplace Modal */}
        {factura && (
          <RemoveMarketplaceModal
            open={removeMarketplaceModalOpen}
            onClose={() => setRemoveMarketplaceModalOpen(false)}
            onSuccess={() => fetchFactura()}
            facturaData={{
              id: factura.id,
              folio: factura.folio,
              razonSocialReceptor: factura.razonSocialReceptor || "N/A",
            }}
          />
        )}

        <DocumentsRequiredModal
          open={documentsRequiredModalOpen}
          onClose={() => setDocumentsRequiredModalOpen(false)}
        />

        <OfertasDrawer
          open={ofertasDrawerOpen && !isCargada}
          onClose={handleCloseOfertas}
          factura={factura}
          initialOfertaId={ofertaIdParam}
        />
      </Box>
    </Layout>
  );
};

export default FacturaDetail;
