import { Box, Typography, Button } from "@mui/material";
import { Description, Cancel, Upload } from "@mui/icons-material";
import type { Factura } from "../../types/factura";

interface FacturaXmlCardProps {
  factura: Factura;
  onUploadClick: () => void;
  onDownloadClick?: (base64: string, fileName: string) => void;
}

const FacturaXmlCard = ({
  factura,
  onUploadClick,
  onDownloadClick,
}: FacturaXmlCardProps) => {
  const handleDownload = () => {
    if (onDownloadClick && factura.xmlContentBase64) {
      onDownloadClick(
        factura.xmlContentBase64,
        factura.facturaNameFile || "factura.xml",
      );
    }
  };

  const isCargada = factura.estado?.toLowerCase() === "cargada";

  return (
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
          <Description sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
            XML de la Factura
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Documento tributario electrónico
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "var(--color-bg-default-tertiary)",
          borderRadius: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {factura.urlFactura ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Description sx={{ color: "var(--color-fg-success-primary)" }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
              >
                <Typography
                  role="button"
                  sx={{ color: "var(--color-fg-success-primary)", cursor: "pointer" }}
                  onClick={handleDownload}
                >
                  {factura.facturaNameFile || "Archivo XML"}
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                Documento cargado
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Cancel sx={{ color: "var(--color-fg-danger-primary)" }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
              >
                XML No Cargado
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                Adjunta el archivo XML del SII
              </Typography>
            </Box>
          </Box>
        )}
        { isCargada && (<Button
          variant="contained"
          startIcon={<Upload />}
          onClick={onUploadClick}
          sx={{
            backgroundColor: "var(--color-bg-accent-primary)",
            color: "var(--color-fg-on-accent-primary)",
            "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {factura.urlFactura ? "Reemplazar" : "Adjuntar"} XML
        </Button>)}
      </Box>
      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: factura.urlFactura ? "var(--color-fg-success-primary)" : "var(--color-fg-warning-primary)" }}
        >
          {factura.urlFactura
            ? "XML validado correctamente - Folio, RUT y monto coinciden"
            : "Pendiente de subir XML para validación"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FacturaXmlCard;
