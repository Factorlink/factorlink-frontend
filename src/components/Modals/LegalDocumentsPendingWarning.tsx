import { Alert, AlertTitle } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

/** Non-error warning shown after marketplace publish when legal docs are still pending. */
const LegalDocumentsPendingWarning = () => (
  <Alert
    severity="warning"
    icon={<WarningAmberOutlinedIcon />}
    sx={{
      textAlign: "left",
      borderRadius: "var(--radius-m)",
      mt: 2,
    }}
  >
    <AlertTitle sx={{ fontWeight: 700 }}>Documentos legales pendientes</AlertTitle>
    Recuerda que debes adjuntar los documentos legales de tu empresa y esperar su
    aprobación para poder ceder facturas en Factorlink.
  </Alert>
);

export default LegalDocumentsPendingWarning;
