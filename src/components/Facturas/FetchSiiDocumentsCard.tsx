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
          <CloudDownload sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
            Obtener Documentos del SII
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
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
        startIcon={fetching ? <CircularProgress size={20} sx={{ color: "var(--color-fg-on-accent-primary)" }} /> : <CloudDownload />}
        onClick={handleFetch}
        disabled={fetching || disabled}
        sx={{
          backgroundColor: "var(--color-bg-accent-primary)",
          "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
          "&:disabled": { opacity: 0.7 },
          textTransform: "none",
          fontWeight: 600,
          py: 1.5,
          color: "var(--color-fg-on-accent-primary)",
        }}
      >
        {fetching ? "Obteniendo documentos..." : "Obtener Documentos"}
      </Button>
    </Box>
  );
};

export default FetchSiiDocumentsCard;
