import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Description,
  Business,
  Person,
  CalendarToday,
  Send,
  Delete,
  Upload,
  Settings,
  ErrorOutline,
  ArrowBack,
  Cancel,
  Visibility,
  ExpandMore,
  ExpandLess,
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
        icon: <Business sx={{ fontSize: 14 }} />,
      };
    case "CON_OFERTAS":
      return {
        label: "CON OFERTAS",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "CEDIDA":
      return {
        label: "CEDIDA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "EN_COBRANZA":
      return {
        label: "EN COBRANZA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "COBRADA":
      return {
        label: "COBRADA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
      };
    case "NO_COBRADA":
      return {
        label: "NO COBRADA",
        color: "#00A86B",
        bgColor: "rgba(0, 168, 107, 0.1)",
        icon: <Description sx={{ fontSize: 14 }} />,
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
    month: "long",
    year: "numeric",
  });
};

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
  const [visibilidadExpanded, setVisibilidadExpanded] = useState(false);

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

  const handleAdjuntarXML = () => {
    setUploadXmlModalOpen(true);
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

  const statusConfig = getStatusConfig(factura.estado);
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

        {/* Card 1: Datos de la Factura */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                <Description sx={{ color: "#00BCD4", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1E293B" }}
                >
                  Datos de la Factura
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Información general del documento
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              sx={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 600,
                "& .MuiChip-icon": { color: statusConfig.color },
              }}
            />
          </Box>

          {/* Datos Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              mb: 3,
            }}
          >
            {/* Folio */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                # Folio
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#00BCD4", fontWeight: 700 }}
              >
                #{factura.folio}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                SII ID: {factura.siiId || "N/A"}
              </Typography>
            </Box>

            {/* Emisor */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <Business sx={{ fontSize: 14 }} /> Emisor
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                {factura.razonSocialEmisor || "N/A"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                {factura.rutEmisor || ""}
              </Typography>
            </Box>

            {/* Receptor */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <Business sx={{ fontSize: 14 }} /> Receptor
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                {factura.razonSocialReceptor || "N/A"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                {factura.rutReceptor || ""}
              </Typography>
            </Box>

            {/* RUT Firmante */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <Person sx={{ fontSize: 14 }} /> RUT Firmante
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                {factura.rutFirmante || "N/A"}
              </Typography>
            </Box>

            {/* Fecha Emisión */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <CalendarToday sx={{ fontSize: 14 }} /> Fecha de Emisión
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                {formatDate(factura.fechaEmision)}
              </Typography>
            </Box>

            {/* Fecha Recepción */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <CalendarToday sx={{ fontSize: 14 }} /> Fecha de Recepción
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                {formatDate(factura.fechaRecepcion)}
              </Typography>
            </Box>
          </Box>

          {/* Plazo */}
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", mb: 0.5, display: "block" }}
            >
              Plazo
            </Typography>
            <Chip
              label={`${factura.plazo || 0} días`}
              size="small"
              sx={{
                backgroundColor: "#F1F5F9",
                color: "#475569",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Card 2: Detalle de Montos */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#1E293B", mb: 2 }}
          >
            Detalle de Montos
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(5, 1fr)" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#F8FAFC",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Monto Neto
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1E293B" }}
              >
                {formatCurrency(factura.montoNeto)}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#F8FAFC",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                IVA (19%)
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1E293B" }}
              >
                {formatCurrency(factura.detalleIva)}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#F8FAFC",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Descuento Global
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1E293B" }}
              >
                {formatCurrency(factura.descuentoGlobal)}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "rgba(0, 168, 107, 0.2)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#00A86B" }}>
                Monto Total
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#00A86B" }}
              >
                {formatCurrency(factura.montoTotal)}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "rgba(0, 168, 107, 0.2)",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#00A86B" }}>
                Monto a Financiar
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#00A86B" }}
              >
                {formatCurrency(factura.montoFinanciar)}
              </Typography>
            </Box>
          </Box>
        </Box>

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
              <Box>
                <Box
                  onClick={() => setVisibilidadExpanded(!visibilidadExpanded)}
                  sx={{
                    backgroundColor: "#F8FAFC",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#F1F5F9" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Visibility sx={{ color: "#00BCD4", fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                      Factorings seleccionados
                    </Typography>
                    <Chip
                      label={factura.visibilidadDetalle?.factorings?.length || 0}
                      size="small"
                      sx={{
                        backgroundColor: "#E0F7FA",
                        color: "#00838F",
                        fontWeight: 700,
                        minWidth: 28,
                        height: 24,
                      }}
                    />
                  </Box>
                  {visibilidadExpanded ? (
                    <ExpandLess sx={{ color: "#64748B" }} />
                  ) : (
                    <ExpandMore sx={{ color: "#64748B" }} />
                  )}
                </Box>

                {visibilidadExpanded && (
                  <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                    {factura.visibilidadDetalle?.factorings?.map((factoring, index) => (
                      <Box
                        key={factoring.id || index}
                        sx={{
                          backgroundColor: "#F8FAFC",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Business sx={{ color: "#00BCD4", fontSize: 20 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                            {factoring.razonSocial}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            {factoring.rut}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    {(!factura.visibilidadDetalle?.factorings || factura.visibilidadDetalle.factorings.length === 0) && (
                      <Typography variant="body2" sx={{ color: "#94A3B8", textAlign: "center", py: 2 }}>
                        No hay factorings seleccionados
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
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
                <Description sx={{ color: "#00BCD4", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1E293B" }}
                >
                  XML de la Factura
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Documento tributario electrónico
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: "#F8FAFC",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {factura.urlFactura ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Description sx={{ color: "#00A86B" }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#1E293B" }}
                    >
                      <Typography
                        role="button"
                        sx={{ color: "#00A86B", cursor: "pointer" }}
                        onClick={() =>
                          handleDescargarXML(
                            factura.xmlContentBase64,
                            factura.facturaNameFile || "factura.xml",
                          )
                        }
                      >
                        {factura.facturaNameFile || "Archivo XML"}
                      </Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Documento cargado
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Cancel sx={{ color: "#EF4444" }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#1E293B" }}
                    >
                      XML No Cargado
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Adjunta el archivo XML del SII
                    </Typography>
                  </Box>
                </Box>
              )}
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={handleAdjuntarXML}
                sx={{
                  backgroundColor: "#00BCD4",
                  color: "white",
                  "&:hover": { backgroundColor: "#00ACC1" },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {factura.urlFactura ? "Reemplazar" : "Adjuntar"} XML
              </Button>
            </Box>
          </Box>

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
      </Box>
    </Layout>
  );
};

export default FacturaDetail;
