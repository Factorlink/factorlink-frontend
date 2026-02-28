import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { useFacturas } from "../../hooks/useFacturas";
import type { Factura } from "../../types/factura";

interface FetchSiiDocumentsCardProps {
  facturaId: string;
  onSuccess: (data: Factura) => void;
  disabled?: boolean;
}

const FetchSiiDocumentsCard = ({ facturaId, onSuccess, disabled }: FetchSiiDocumentsCardProps) => {
  const { fetchXMLContent } = useFacturas();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFetch = async () => {
    try {
      setFetching(true);
      setError(null);
      setSuccess(false);
      const data = await fetchXMLContent(facturaId);
      setSuccess(true);
      onSuccess(data);
    } catch (err) {
      console.error("Error fetching SII documents:", err);
      setError("No se pudieron obtener los documentos del SII. Intente nuevamente.");
    } finally {
      setFetching(false);
    }
  };

  return (
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
          <CloudDownload sx={{ color: "#00BCD4", fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
            Obtener Documentos del SII
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Obten automáticamente el XML y PDF asociados a esta factura desde el SII
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Documentos obtenidos exitosamente desde el SII
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        startIcon={fetching ? <CircularProgress size={20} sx={{ color: "white" }} /> : <CloudDownload />}
        onClick={handleFetch}
        disabled={fetching || disabled}
        sx={{
          backgroundColor: "#00BCD4",
          "&:hover": { backgroundColor: "#00ACC1" },
          "&:disabled": { opacity: 0.7 },
          textTransform: "none",
          fontWeight: 600,
          py: 1.5,
          color: "white",
        }}
      >
        {fetching ? "Obteniendo documentos..." : "Obtener Documentos"}
      </Button>
    </Box>
  );
};

export default FetchSiiDocumentsCard;
