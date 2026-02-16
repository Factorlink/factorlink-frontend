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
            Volver a Marketplace
          </Button>
        </Box>

        <FacturaResumenCard factura={factura} />
      </Box>
    </Layout>
  );
};

export default FacturaFactoringDetail;
