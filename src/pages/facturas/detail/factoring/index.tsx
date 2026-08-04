import { useNavigate, useParams } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import { ArrowBack, Description, ErrorOutline } from "@mui/icons-material";
import FacturaResumenCard from "../../../../components/Facturas/FacturaResumenCard";
import EnviarOfertaCard from "../../../../components/Facturas/EnviarOfertaCard";
import DetalleOfertaFactoring from "../../../../components/Ofertas/DetalleOfertaFactoring";
import HistorialOfertasFactoring from "../../../../components/Ofertas/HistorialOfertasFactoring";
import DetalleCotizacionCard from "../../../../components/Facturas/DetalleCotizacionCard";

const FacturaFactoringDetail = () => {
  const { getFacturaByIdAndFactoringId, loading } = useFacturas();
  const { currentRole } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleBack = () => {
    navigate(-1);
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
            <Description sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)" }} />
            <Typography variant="h6" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Factura no encontrada
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3, flex: 1 }}>
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

        <FacturaResumenCard factura={factura} />

        {factura.estado !== "CARGADA" && (
          <DetalleCotizacionCard
            plazo={factura.plazo}
            porcentajeFinanciamiento={factura.porcentajeFinanciamiento || "0"}
            montoFinanciar={factura.montoFinanciar}
          />
        )}

        {/* Oferta: detalle si ya existe, formulario si no */}
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
          />
        )}

        {/* Historial de ofertas anteriores */}
        {factura.historyOfertas && factura.historyOfertas.length > 0 && (
          <HistorialOfertasFactoring
            ofertas={factura.historyOfertas}
            plazo={factura.plazo || 0}
          />
        )}
      </Box>
    </Layout>
  );
};

export default FacturaFactoringDetail;
