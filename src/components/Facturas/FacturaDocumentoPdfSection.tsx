import { Box, Typography } from "@mui/material";
import { PictureAsPdf, InfoOutlined } from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import {
  downloadFacturaPdf,
  getFacturaPdfFileName,
  hasFacturaPdfDownloadable,
} from "../../utils/facturaDocuments";

interface FacturaDocumentoPdfSectionProps {
  factura: Factura;
}

const FacturaDocumentoPdfSection = ({ factura }: FacturaDocumentoPdfSectionProps) => {
  const pdfAvailable = hasFacturaPdfDownloadable(factura);
  const fileName = getFacturaPdfFileName(factura);

  const handleDownloadPdf = () => {
    downloadFacturaPdf(factura);
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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
          >
            Documento de la factura
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            PDF asociado a esta factura
          </Typography>
        </Box>
      </Box>

      {pdfAvailable ? (
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-tertiary)",
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <PictureAsPdf sx={{ color: "var(--color-fg-success-primary)" }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
              <Typography
                role="button"
                sx={{ color: "var(--color-fg-success-primary)", cursor: "pointer" }}
                onClick={handleDownloadPdf}
              >
                {fileName}
              </Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Documento cargado
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-tertiary)",
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <InfoOutlined sx={{ color: "var(--color-fg-default-secondary)", mt: 0.25 }} />
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
            >
              PDF no disponible
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
              No hay un documento PDF asociado a esta factura o no tienes acceso para
              consultarlo.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FacturaDocumentoPdfSection;
