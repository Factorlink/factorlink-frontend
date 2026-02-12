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

  return (
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
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
                  onClick={handleDownload}
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
          onClick={onUploadClick}
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
      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: factura.urlFactura ? "#00A86B" : "#F59E0B" }}
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
