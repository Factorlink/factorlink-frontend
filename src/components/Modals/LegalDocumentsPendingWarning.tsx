import { Alert, AlertTitle } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

/** Non-error warning shown after marketplace publish when the API returns message_warning. */
const LegalDocumentsPendingWarning = ({ message }: { message: string }) => (
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
    {message}
  </Alert>
);

export default LegalDocumentsPendingWarning;
