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
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { useFacturas } from "../../hooks/useFacturas";

interface DeleteFacturaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  facturaData: {
    id: string;
    folio: string;
    razonSocialReceptor: string;
    montoTotal: string;
  };
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const DeleteFacturaModal = ({
  open,
  onClose,
  onSuccess,
  facturaData,
}: DeleteFacturaModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");

  const { deleteFactura, loading } = useFacturas();

  const handleDelete = async () => {
    try {
      await deleteFactura(facturaData.id);

      setAlertStatus("success");
      setAlertMessage("Factura eliminada correctamente.");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al eliminar la factura"
      );
    }
  };

  const handleClose = () => {
    if (alertStatus === "success") {
      onSuccess?.();
    }
    setAlertStatus(null);
    setAlertMessage("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
              borderRadius: 2,
              backgroundColor: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Eliminar Factura
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert
            severity={alertStatus}
            sx={{ mb: 3 }}
            onClose={() => {
              handleClose();
              setAlertStatus(null);
              setAlertMessage("");
            }}
          >
            {alertMessage}
          </Alert>
        )}

        {alertStatus !== "success" && (
          <Box
            sx={{
              borderRadius: 2,
              p: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(0, 188, 212, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon sx={{ color: "primary.main" }} />
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  Folio #{facturaData.folio}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {facturaData.razonSocialReceptor} • {formatCurrency(facturaData.montoTotal)}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "#EF4444", lineHeight: 1.6 }}
            >
              ¿Estás seguro de que deseas eliminar esta factura? Esta acción
              no se puede deshacer y se perderá toda la información asociada.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {alertStatus === "success" ? "Cerrar" : "Cancelar"}
        </Button>
        {alertStatus !== "success" && (
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "#EF4444",
              "&:hover": {
                backgroundColor: "#DC2626",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Eliminar Factura"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFacturaModal;
