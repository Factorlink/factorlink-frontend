import { Box, Typography, Button } from "@mui/material";
import { PictureAsPdf, Cancel, Upload } from "@mui/icons-material";
import type { Factura } from "../../types/factura";

interface FacturaPdfCardProps {
  factura: Factura;
  onUploadClick: () => void;
  onDownloadClick?: (base64: string, fileName: string) => void;
}

const FacturaPdfCard = ({
  factura,
  onUploadClick,
  onDownloadClick,
}: FacturaPdfCardProps) => {
  const handleDownload = () => {
    if (onDownloadClick && factura.pdfContentBase64) {
      onDownloadClick(
        factura.pdfContentBase64,
        factura.facturaNameFilePDF || "factura.pdf",
      );
    }
  };

  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const hasPdf = !!factura.facturaNameFilePDF;

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
          <PictureAsPdf sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
            PDF de la Factura
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Documento tributario en formato PDF
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
        {hasPdf ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PictureAsPdf sx={{ color: "var(--color-fg-success-primary)" }} />
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
                  {factura.facturaNameFilePDF || "Archivo PDF"}
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
                PDF No Cargado
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                Adjunta el archivo PDF de la factura
              </Typography>
            </Box>
          </Box>
        )}
        {isCargada && (
          <Button
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
            {hasPdf ? "Reemplazar" : "Adjuntar"} PDF
          </Button>
        )}
      </Box>
      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: hasPdf ? "var(--color-fg-success-primary)" : "var(--color-fg-warning-primary)" }}
        >
          {hasPdf
            ? "PDF cargado correctamente"
            : "Pendiente de subir PDF"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FacturaPdfCard;
