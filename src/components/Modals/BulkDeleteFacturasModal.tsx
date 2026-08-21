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

export interface BulkDeleteFacturaItem {
  id: string;
  folio: string;
  razonSocialReceptor: string;
  montoTotal: string;
}

interface BulkDeleteFacturasModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  facturas: BulkDeleteFacturaItem[];
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

const BulkDeleteFacturasModal = ({
  open,
  onClose,
  onSuccess,
  facturas,
}: BulkDeleteFacturasModalProps) => {
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");

  const { deleteFacturasBulk, loading } = useFacturas();

  const handleDelete = async () => {
    try {
      await deleteFacturasBulk(facturas.map((factura) => factura.id));

      setAlertStatus("success");
      setAlertMessage("Facturas eliminadas correctamente.");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al eliminar las facturas",
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
              backgroundColor: "var(--color-bg-danger-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Eliminar facturas
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert severity={alertStatus} sx={{ mb: 3 }}>
            {alertMessage}
          </Alert>
        )}

        {alertStatus !== "success" && (
          <Box
            sx={{
              borderRadius: "var(--radius-m)",
              p: 2,
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2, fontWeight: 500 }}
            >
              Se eliminarán {facturas.length} factura
              {facturas.length === 1 ? "" : "s"}:
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 2,
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              {facturas.map((factura) => (
                <Box
                  key={factura.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
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
                      flexShrink: 0,
                    }}
                  >
                    <DescriptionIcon sx={{ color: "primary.main" }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.primary", fontWeight: 600 }}
                    >
                      Folio #{factura.folio}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      {factura.razonSocialReceptor} •{" "}
                      {formatCurrency(factura.montoTotal)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-danger-primary)", lineHeight: 1.6 }}
            >
              ¿Estás seguro de que deseas eliminar estas facturas? Esta acción
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
            borderRadius: "var(--radius-m)",
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
            disabled={loading || facturas.length === 0}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: "var(--radius-m)",
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              backgroundColor: "var(--color-bg-danger-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-danger-primary-hover)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Eliminar facturas"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BulkDeleteFacturasModal;
