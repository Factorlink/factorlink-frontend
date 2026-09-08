import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ArrowBack, Delete } from "@mui/icons-material";
import Layout from "../../../../components/Layout";
import { useFacturaGrupos } from "../../../../hooks/useFacturaGrupos";
import { appContentSx, pageHeaderSx } from "../../../../theme/layoutStyles";

type GrupoDetalleLocationState = {
  nombre?: string;
};

const FacturaGrupoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteFacturaGrupo, loading } = useFacturaGrupos();
  const nombre = (location.state as GrupoDetalleLocationState | null)?.nombre;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToGrupos = (replace = false) => {
    navigate("/facturas/grupos", { replace });
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setError(null);
      await deleteFacturaGrupo(id);
      goToGrupos(true);
    } catch (err) {
      console.error("Error deleting factura grupo:", err);
      setError("No se pudo eliminar el grupo. Intente nuevamente.");
      setConfirmOpen(false);
    }
  };

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box sx={pageHeaderSx}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Grupo de cotización
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              Stub temporal. Id del grupo: {id || "—"}
              {nombre ? ` · ${nombre}` : ""}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, maxWidth: 560 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => goToGrupos()}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Volver a grupos
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setConfirmOpen(true)}
            disabled={!id || loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-danger-primary)",
              borderColor: "var(--color-border-danger-secondary)",
              "&:hover": {
                borderColor: "var(--color-border-danger-secondary)",
                backgroundColor: "var(--color-bg-danger-secondary)",
              },
            }}
          >
            Eliminar grupo
          </Button>
        </Box>
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => !loading && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "var(--radius-l)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Eliminar grupo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ¿Estás seguro de que deseas eliminar este grupo? Esta acción no se
            puede deshacer.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {nombre || "Grupo"} · {id}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
              backgroundColor: "var(--color-bg-danger-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-danger-primary-hover)",
              },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default FacturaGrupoDetalle;
