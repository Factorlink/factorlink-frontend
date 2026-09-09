import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Description, ErrorOutline, ArrowBack } from "@mui/icons-material";
import Layout from "../../../components/Layout";
import type { Factura } from "../../../types/factura";
import { useFacturas } from "../../../hooks/useFacturas";
import FacturaDetallePanel from "../../../components/Facturas/FacturaDetallePanel";
import { appContentSx } from "../../../theme/layoutStyles";

const FacturaDetail = () => {
  const { getFacturaById, loading } = useFacturas();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const ofertaIdParam = searchParams.get("ofertaId");
  const shouldOpenOfertas =
    searchParams.get("ofertas") === "true" || Boolean(ofertaIdParam);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      void fetchFactura();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!factura) return;

    if (factura.estado?.toLowerCase() === "cargada") {
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
    }
  }, [factura, searchParams, setSearchParams]);

  const handleBack = () => {
    navigate("/facturas");
  };

  const handleOfertasOpenChange = (open: boolean) => {
    if (open) {
      if (searchParams.get("ofertas") === "true") return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("ofertas", "true");
          return next;
        },
        { replace: true },
      );
      return;
    }
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

  if (loading && !factura) {
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
          <Typography
            variant="body1"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Cargando factura...
          </Typography>
        </Box>
      </Layout>
    );
  }

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
            <ErrorOutline
              sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)" }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "var(--color-fg-default-primary)",
                fontWeight: 500,
                fontFamily: "var(--font-heading)",
              }}
            >
              Error al cargar la factura
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                void fetchFactura();
              }}
              sx={{
                mt: 2,
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-accent-primary-hover)",
                },
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
            <Description
              sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              Factura no encontrada
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={appContentSx}>
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

        <FacturaDetallePanel
          factura={factura}
          onFacturaChange={setFactura}
          onDeleted={() => navigate("/facturas")}
          variant="page"
          openOfertas={shouldOpenOfertas}
          initialOfertaId={ofertaIdParam}
          onOfertasOpenChange={handleOfertasOpenChange}
        />
      </Box>
    </Layout>
  );
};

export default FacturaDetail;
