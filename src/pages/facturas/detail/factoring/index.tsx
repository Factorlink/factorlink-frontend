import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFacturas } from "../../../../hooks/useFacturas";
import useAuthStore from "../../../../store/authStore";
import { useEffect, useState } from "react";
import type { Factura } from "../../../../types/factura";
import Layout from "../../../../components/Layout";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Description,
  ErrorOutline,
  History,
  InfoOutlined,
  Send,
} from "@mui/icons-material";
import FacturaResumenCard from "../../../../components/Facturas/FacturaResumenCard";
import EnviarOfertaCard from "../../../../components/Facturas/EnviarOfertaCard";
import DetalleOfertaFactoring from "../../../../components/Ofertas/DetalleOfertaFactoring";
import HistorialOfertasFactoring from "../../../../components/Ofertas/HistorialOfertasFactoring";
import DetalleCotizacionCard from "../../../../components/Facturas/DetalleCotizacionCard";
import { appContentSx } from "../../../../theme/layoutStyles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    <Box sx={{ pt: 3 }}>{children}</Box>
  </div>
);

const getTabIndex = (tab: string | null) => {
  if (tab === "oferta") return 1;
  if (tab === "historial") return 2;
  return 0;
};

const getTabParam = (index: number) => {
  if (index === 1) return "oferta";
  if (index === 2) return "historial";
  return null;
};

const getPageHeader = (tab: number, hasOferta: boolean) => {
  if (tab === 1) {
    return hasOferta
      ? {
          title: "Tu oferta",
          subtitle: "Revisa el estado de la oferta enviada para esta factura",
        }
      : {
          title: "Enviar oferta",
          subtitle:
            "Completa la información para enviar tu oferta por esta factura",
        };
  }

  if (tab === 2) {
    return {
      title: "Historial de ofertas",
      subtitle: "Consulta todas las ofertas que has enviado para esta factura",
    };
  }

  return {
    title: "Detalle de la factura",
    subtitle: "Revisa la información de la factura antes de enviar tu oferta",
  };
};

const FacturaFactoringDetail = () => {
  const { getFacturaByIdAndFactoringId, loading } = useFacturas();
  const { currentRole } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = getTabIndex(searchParams.get("tab"));
  const ofertaIdParam = searchParams.get("ofertaId");
  const [factura, setFactura] = useState<Factura | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const fetchFactura = async () => {
    try {
      setError(null);
      const data = await getFacturaByIdAndFactoringId(
        id!,
        currentRole?.factoringId!,
      );
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
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleBack = () => {
    navigate("/marketplace");
  };

  const goToTab = (index: number) => {
    setActiveTab(index);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const param = getTabParam(index);
        if (param) next.set("tab", param);
        else next.delete("tab");
        if (index !== 2) next.delete("ofertaId");
        return next;
      },
      { replace: true },
    );
  };

  const handleTabChange = (_event: unknown, newValue: number) => {
    goToTab(newValue);
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

  const { title, subtitle } = getPageHeader(
    activeTab,
    Boolean(factura.ofertaFactoring),
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
            Volver a Marketplace
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: "var(--font-heading)",
              color: "var(--color-fg-default-primary)",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)", mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab
              icon={<Description sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Detalle de la factura"
            />
            <Tab
              icon={<Send sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={factura.ofertaFactoring ? "Tu oferta" : "Enviar oferta"}
            />
            <Tab
              icon={<History sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Historial de ofertas"
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <FacturaResumenCard factura={factura} showSolicitudFields={false} />

          {factura.estado !== "CARGADA" && (
            <DetalleCotizacionCard
              plazo={factura.plazo}
              porcentajeFinanciamiento={factura.porcentajeFinanciamiento || "0"}
              montoFinanciar={factura.montoFinanciar}
            />
          )}

          {!factura.ofertaFactoring && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mt: 1,
                p: 2.5,
                borderRadius: 2,
                backgroundColor: "var(--color-bg-accent-secondary)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
                <InfoOutlined
                  sx={{ color: "var(--color-fg-accent-primary)", mt: 0.25, flexShrink: 0 }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                  >
                    ¿Listo para enviar tu oferta?
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Con esta información podrás definir las condiciones de tu oferta y enviarla a la empresa.
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() => goToTab(1)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  color: "var(--color-fg-on-accent-primary)",
                  flexShrink: 0,
                }}
              >
                Continuar para enviar oferta
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {factura.ofertaFactoring ? (
            <DetalleOfertaFactoring
              oferta={factura.ofertaFactoring}
              plazo={factura.plazo || 0}
            />
          ) : (
            <EnviarOfertaCard
              factura={factura}
              factoringId={currentRole?.factoringId!}
              onSuccess={fetchFactura}
              onCancel={() => goToTab(0)}
            />
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <HistorialOfertasFactoring
            ofertas={factura.historyOfertas || []}
            plazo={factura.plazo || 0}
            initialOfertaId={ofertaIdParam}
          />
        </TabPanel>
      </Box>
    </Layout>
  );
};

export default FacturaFactoringDetail;
