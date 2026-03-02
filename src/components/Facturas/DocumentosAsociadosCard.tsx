import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert, Divider } from "@mui/material";
import { Description, PictureAsPdf, Cancel, Upload, CloudDownload } from "@mui/icons-material";
import { useFacturas } from "../../hooks/useFacturas";
import type { Factura } from "../../types/factura";
import useAuthStore from "../../store/authStore";

interface DocumentosAsociadosCardProps {
  factura: Factura;
  onUploadXmlClick: () => void;
  onUploadPdfClick: () => void;
  onDownloadXml?: (base64: string, fileName: string) => void;
  onDownloadPdf?: (base64: string, fileName: string) => void;
  onFetchSiiSuccess: (data: Factura) => void;
}

const DocumentosAsociadosCard = ({
  factura,
  onUploadXmlClick,
  onUploadPdfClick,
  onDownloadXml,
  onDownloadPdf,
  onFetchSiiSuccess,
}: DocumentosAsociadosCardProps) => {
  const { fetchXMLContent } = useFacturas();
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const isPersonalLinked = empresa?.siiRutPersonal != null;

  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const hasPdf = !!factura.facturaNameFilePDF;

  const handleDownloadXml = () => {
    if (onDownloadXml && factura.xmlContentBase64) {
      onDownloadXml(factura.xmlContentBase64, factura.facturaNameFile || "factura.xml");
    }
  };

  const handleDownloadPdf = () => {
    if (onDownloadPdf && factura.pdfContentBase64) {
      onDownloadPdf(factura.pdfContentBase64, factura.facturaNameFilePDF || "factura.pdf");
    }
  };

  const handleFetchSii = async () => {
    try {
      setFetching(true);
      setFetchError(null);
      setFetchSuccess(false);
      const data = await fetchXMLContent(factura.id);
      setFetchSuccess(true);
      onFetchSiiSuccess(data);
    } catch (err) {
      console.error("Error fetching SII documents:", err);
      setFetchError("No se pudieron obtener los documentos del SII. Intente nuevamente.");
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
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
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
            Documentos Asociados
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            XML, PDF y obtención automática desde el SII
          </Typography>
        </Box>
      </Box>

      {/* Fila 1: XML */}
      <Box
        sx={{
          backgroundColor: "#F8FAFC",
          borderRadius: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        {factura.urlFactura ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Description sx={{ color: "#00A86B" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                <Typography
                  role="button"
                  sx={{ color: "#00A86B", cursor: "pointer" }}
                  onClick={handleDownloadXml}
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
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                XML No Cargado
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Adjunta el archivo XML del SII
              </Typography>
            </Box>
          </Box>
        )}
        {isCargada && (
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={onUploadXmlClick}
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
        )}
      </Box>
      <Box sx={{ pl: 2, mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: factura.urlFactura ? "#00A86B" : "#F59E0B" }}
        >
          {factura.urlFactura
            ? "XML validado correctamente - Folio, RUT y monto coinciden"
            : "Pendiente de subir XML para validación"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Fila 2: PDF */}
      <Box
        sx={{
          backgroundColor: "#F8FAFC",
          borderRadius: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        {hasPdf ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PictureAsPdf sx={{ color: "#00A86B" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                <Typography
                  role="button"
                  sx={{ color: "#00A86B", cursor: "pointer" }}
                  onClick={handleDownloadPdf}
                >
                  {factura.facturaNameFilePDF || "Archivo PDF"}
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
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B" }}>
                PDF No Cargado
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Adjunta el archivo PDF de la factura
              </Typography>
            </Box>
          </Box>
        )}
        {isCargada && (
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={onUploadPdfClick}
            sx={{
              backgroundColor: "#00BCD4",
              color: "white",
              "&:hover": { backgroundColor: "#00ACC1" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {hasPdf ? "Reemplazar" : "Adjuntar"} PDF
          </Button>
        )}
      </Box>
      <Box sx={{ pl: 2, mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: hasPdf ? "#00A86B" : "#F59E0B" }}
        >
          {hasPdf ? "PDF cargado correctamente" : "Pendiente de subir PDF"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Fila 3: Obtener documentos del SII */}
      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>
          {fetchError}
        </Alert>
      )}

      {fetchSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFetchSuccess(false)}>
          Documentos obtenidos exitosamente desde el SII
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        startIcon={fetching ? <CircularProgress size={20} sx={{ color: "white" }} /> : <CloudDownload />}
        onClick={isPersonalLinked ? handleFetchSii : () => {}}
        disabled={fetching}
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
        {fetching ? "Obteniendo documentos..." : "Obtener XML y PDF desde el SII"}
      </Button>
      <Box sx={{ pl: 2, pt: 1 }}>
        <Typography variant="caption" sx={{ color: "#64748B" }}>
          Obten automáticamente ambos documentos asociados a esta factura desde el SII
        </Typography>
      </Box>
    </Box>
  );
};

export default DocumentosAsociadosCard;
