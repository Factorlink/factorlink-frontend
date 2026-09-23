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

const digitsOnly = (value: string) => value.replace(/\D/g, "").slice(0, 4);

const AceptarOfertaModal = ({
  open,
  onClose,
  onSuccess,
  ofertaData,
}: AceptarOfertaModalProps) => {
  const [phase, setPhase] = useState<AcceptPhase>("confirm");
  const [errorMessage, setErrorMessage] = useState("");
  const [comentario, setComentario] = useState("");
  const [siiPasswordCertificadoPersonal, setSiiPasswordCertificadoPersonal] =
    useState("");
  const { responderOferta } = useOfertas();

  const resetForm = () => {
    setPhase("confirm");
    setErrorMessage("");
    setComentario("");
    setSiiPasswordCertificadoPersonal("");
  };

  const handleAccept = async () => {
    setPhase("loading");
    try {
      await responderOferta(ofertaData.id, {
        estado: "aceptada",
        comentarioEmpresa: comentario,
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
    setPhase("confirm");
    setErrorMessage("");
    setSiiPasswordCertificadoPersonal("");
  };

  const handleSuccessClose = () => {
    resetForm();
    onSuccess?.();
    onClose();
  };

  const canSubmit = siiPasswordCertificadoPersonal.length > 0;

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
                setSiiPasswordCertificadoPersonal(digitsOnly(e.target.value))
              }
              placeholder="Hasta 4 dígitos"
              sx={{ mt: 2 }}
              inputProps={{
                maxLength: 4,
                inputMode: "numeric",
                autoComplete: "off",
                "aria-label": "siiPasswordCertificadoPersonal",
              }}
            />

            <TextField
              label="Comentario (opcional)"
              multiline
              minRows={3}
              maxRows={5}
              fullWidth
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe un comentario para el factoring..."
              sx={{ mt: 2 }}
              inputProps={{ maxLength: 500 }}
            />
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
