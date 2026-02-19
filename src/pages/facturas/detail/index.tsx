import { useParams, useNavigate } from "react-router-dom";
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
import DeleteFacturaModal from "../../../components/Modals/DeleteFacturaModal";
import RemoveMarketplaceModal from "../../../components/Modals/RemoveMarketplaceModal";
import DocumentsRequiredModal from "../../../components/Modals/DocumentsRequiredModal";
import StorefrontIcon from "@mui/icons-material/Storefront";
import useAuthStore from "../../../store/authStore";
import FactoringsList from "../../../components/Facturas/FactoringsList";
import OfertasDrawer from "../../../components/Facturas/OfertasDrawer";
import FacturaXmlCard from "../../../components/Facturas/FacturaXmlCard";
import FacturaResumenCard from "../../../components/Facturas/FacturaResumenCard";
import DetalleCotizacionCard from "../../../components/Facturas/DetalleCotizacionCard";


const FacturaDetail = () => {
  const { getFacturaById, loading, refreshFactura } = useFacturas();
  const { currentRole } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadXmlModalOpen, setUploadXmlModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeMarketplaceModalOpen, setRemoveMarketplaceModalOpen] = useState(false);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] = useState(false);
  const [ofertasDrawerOpen, setOfertasDrawerOpen] = useState(false);

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

  const handleBack = () => {
    navigate(-1);
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
          <CircularProgress sx={{ color: "#00BCD4" }} />
          <Typography variant="body1" sx={{ color: "#64748B" }}>
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
        <Box sx={{ p: 3 }}>
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
            <ErrorOutline sx={{ fontSize: 64, color: "#EF4444" }} />
            <Typography variant="h6" sx={{ color: "#1E293B", fontWeight: 600 }}>
              Error al cargar la factura
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                mt: 2,
                backgroundColor: "#00BCD4",
                "&:hover": { backgroundColor: "#00ACC1" },
                textTransform: "none",
                color: "white",
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
        <Box sx={{ p: 3 }}>
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
            <Description sx={{ fontSize: 64, color: "#CBD5E1" }} />
            <Typography variant="h6" sx={{ color: "#64748B" }}>
              Factura no encontrada
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  const canEnviarCotizar = factura.estado?.toLowerCase() === "cargada";
  const isInMarketplace = factura.estado === "EN_MARKETPLACE" || factura.estado === "CON_OFERTAS";

  return (
    <Layout>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              color: "#64748B",
              textTransform: "none",
              "&:hover": { backgroundColor: "#F1F5F9" },
            }}
          >
            Volver a facturas
          </Button>
        </Box>

        <FacturaResumenCard factura={factura} />

        {factura.estado !== "CARGADA" && (
          <DetalleCotizacionCard
            plazo={factura.plazo}
            porcentajeFinanciamiento={factura.porcentajeFinanciamiento || "0"}
            montoFinanciar={factura.montoFinanciar}
          />
        )}

        {/* Card: Visibilidad en Marketplace */}
        {(factura.visibilidad === "TODOS" || factura.visibilidad === "SELECCIONADOS") && (
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
              p: 3,
              mb: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: "#F1F5F9",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Visibility sx={{ color: "#00BCD4", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
                  Visibilidad en Marketplace
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Factorings que pueden ver esta factura
                </Typography>
              </Box>
            </Box>

            {factura.visibilidad === "TODOS" ? (
              <Box
                sx={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Visibility sx={{ color: "#00A86B", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#15803D", fontWeight: 500 }}>
                  Esta factura es visible para todos los factorings registrados en la plataforma.
                </Typography>
              </Box>
            ) : (
              <FactoringsList
                factorings={factura.visibilidadDetalle?.factorings || []}
              />
            )}
          </Box>
        )}

        {/* Bottom Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
          }}
        >
          {/* Card 3: XML de la Factura */}
          <FacturaXmlCard
            factura={factura}
            onUploadClick={() => setUploadXmlModalOpen(true)}
            onDownloadClick={handleDescargarXML}
          />

          {/* Card 4: Acciones */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  backgroundColor: "#F1F5F9",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Settings sx={{ color: "#00BCD4", fontSize: 24 }} />
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
                  onClick={() => setOfertasDrawerOpen(true)}
                  sx={{
                    borderColor: "#00BCD4",
                    color: "#00BCD4",
                    "&:hover": {
                      borderColor: "#00ACC1",
                      backgroundColor: "rgba(0,188,212,0.08)",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  Ver ofertas
                </Button>
              )}
              <Button
                variant="contained"
                fullWidth
                startIcon={<Send />}
                onClick={handleEnviarCotizar}
                disabled={!canEnviarCotizar}
                sx={{
                  backgroundColor: "#00BCD4",
                  "&:hover": { backgroundColor: "#00ACC1" },
                  "&:disabled": {
                    opacity: 0.7,
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  color: "white",
                }}
              >
                Enviar a cotizar
              </Button>
              {isInMarketplace ? (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<StorefrontIcon />}
                  onClick={() => setRemoveMarketplaceModalOpen(true)}
                  sx={{
                    borderColor: "#EF4444",
                    color: "#EF4444",
                    "&:hover": {
                      borderColor: "#DC2626",
                      backgroundColor: "rgba(239,68,68,0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  Quitar del marketplace
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Delete />}
                  onClick={handleEliminar}
                  sx={{
                    borderColor: "#EF4444",
                    color: "#EF4444",
                    "&:hover": {
                      borderColor: "#DC2626",
                      backgroundColor: "rgba(239,68,68,0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 600,
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
          open={ofertasDrawerOpen}
          onClose={() => setOfertasDrawerOpen(false)}
          factura={factura}
        />
      </Box>
    </Layout>
  );
};

export default FacturaDetail;
