import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import TextField from "@mui/material/TextField";
import { useOfertas } from "../../hooks/useOfertas";
import {
  formatMoney,
  formatPercent,
  isInformed,
  type OptionalValue,
} from "../../utils/ofertaFormatters";
import CederFacturaProgressModal from "./CederFacturaProgressModal";
import FacturaCedidaModal from "./FacturaCedidaModal";

interface AceptarOfertaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ofertaData: {
    id: string;
    factoringName: string;
    montoAFinanciar: OptionalValue;
    tasa30Dias: OptionalValue;
    porcentajeFinanciamiento: string;
    montoAGirar?: OptionalValue;
    retencion?: OptionalValue;
  };
}

type AcceptPhase = "confirm" | "loading" | "error" | "success";

const buildResumenLine = (ofertaData: AceptarOfertaModalProps["ofertaData"]) => {
  const parts = [
    `Monto a financiar: ${formatMoney(ofertaData.montoAFinanciar)}`,
    `Tasa 30 días: ${formatPercent(ofertaData.tasa30Dias)}`,
  ];
  if (isInformed(ofertaData.montoAGirar)) {
    parts.push(`Monto a girar: ${formatMoney(ofertaData.montoAGirar)}`);
  }
  if (isInformed(ofertaData.retencion)) {
    parts.push(`Retención: ${formatMoney(ofertaData.retencion)}`);
  }
  return parts.join(" • ");
};

const CERT_PASSWORD_MIN = 4;
const CERT_PASSWORD_MAX = 12;

/** Letras y números, entre 4 y 12 caracteres. */
const sanitizeCertPassword = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").slice(0, CERT_PASSWORD_MAX);

const isValidCertPassword = (value: string) =>
  value.length >= CERT_PASSWORD_MIN && value.length <= CERT_PASSWORD_MAX;

const AceptarOfertaModal = ({
  open,
  onClose,
  onSuccess,
  ofertaData,
}: AceptarOfertaModalProps) => {
  const [phase, setPhase] = useState<AcceptPhase>("confirm");
  const [errorMessage, setErrorMessage] = useState("");
  const [siiPasswordCertificadoPersonal, setSiiPasswordCertificadoPersonal] =
    useState("");
  const { responderOferta } = useOfertas();

  const resetForm = () => {
    setPhase("confirm");
    setErrorMessage("");
    setSiiPasswordCertificadoPersonal("");
  };

  const handleAccept = async () => {
    setPhase("loading");
    try {
      await responderOferta(ofertaData.id, {
        estado: "aceptada",
        siiPasswordCertificadoPersonal,
      });
      setPhase("success");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al aceptar la oferta",
      );
      setPhase("error");
    }
  };

  const handleCloseConfirm = () => {
    resetForm();
    onClose();
  };

  const handleCancelError = () => {
    resetForm();
    onClose();
  };

  const handleSuccessClose = () => {
    resetForm();
    onSuccess?.();
    onClose();
  };

  const canSubmit = isValidCertPassword(siiPasswordCertificadoPersonal);

  return (
    <>
      <Dialog
        open={open && phase === "confirm"}
        onClose={handleCloseConfirm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            pt: 3,
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-m)",
                backgroundColor: "var(--color-bg-success-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              ¿Aceptar oferta?
            </Typography>
          </Box>
          <IconButton onClick={handleCloseConfirm}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ borderRadius: "var(--radius-m)", p: 2, mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 2,
                borderRadius: "var(--radius-m)",
                backgroundColor: "var(--color-bg-default-tertiary)",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-m)",
                  bgcolor: "var(--color-bg-accent-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon sx={{ color: "primary.main" }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
                  {ofertaData.factoringName}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {buildResumenLine(ofertaData)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: "var(--color-fg-success-primary)", lineHeight: 1.6 }}>
              Al aceptar esta oferta, la factura se va a ceder al factoring.
              Esta acción no se puede deshacer.
            </Typography>

            <TextField
              label="Clave del certificado personal"
              type="password"
              fullWidth
              value={siiPasswordCertificadoPersonal}
              onChange={(e) =>
                setSiiPasswordCertificadoPersonal(
                  sanitizeCertPassword(e.target.value),
                )
              }
              placeholder="4 a 12 caracteres"
              sx={{ mt: 2 }}
              inputProps={{
                maxLength: CERT_PASSWORD_MAX,
                autoComplete: "off",
                "aria-label": "siiPasswordCertificadoPersonal",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "var(--color-fg-default-secondary)",
                lineHeight: 1.5,
              }}
            >
              Tu clave del certificado personal no se guarda en FactorLink. Solo
              se usa para completar la cesión de la factura.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseConfirm}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleAccept();
            }}
            disabled={!canSubmit}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "var(--color-bg-success-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-success-primary-hover)",
              },
              "&.Mui-disabled": {
                backgroundColor: "var(--color-bg-disabled-primary)",
                color: "var(--color-fg-on-accent-primary)",
                opacity: 0.7,
              },
            }}
          >
            Aceptar y ceder
          </Button>
        </DialogActions>
      </Dialog>

      <CederFacturaProgressModal
        open={open && (phase === "loading" || phase === "error")}
        status={phase === "error" ? "error" : "loading"}
        errorMessage={errorMessage}
        onRetry={() => {
          void handleAccept();
        }}
        onCancel={handleCancelError}
      />

      <FacturaCedidaModal
        open={open && phase === "success"}
        factoringName={ofertaData.factoringName}
        montoAFinanciar={ofertaData.montoAFinanciar}
        tasa30Dias={ofertaData.tasa30Dias}
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default AceptarOfertaModal;
