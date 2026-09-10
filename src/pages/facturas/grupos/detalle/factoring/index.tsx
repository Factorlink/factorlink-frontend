import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack, Groups } from "@mui/icons-material";
import Layout from "../../../../../components/Layout";
import {
  appContentSx,
  pageHeaderSx,
} from "../../../../../theme/layoutStyles";

type GrupoFactoringLocationState = {
  from?: string;
  nombre?: string;
};

const getMarketplaceBackPath = (from: unknown) => {
  if (typeof from === "string" && from.startsWith("/marketplace")) {
    return from;
  }
  return "/marketplace";
};

const FacturaGrupoFactoringDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as GrupoFactoringLocationState | null) ?? null;
  const backPath = getMarketplaceBackPath(state?.from);
  const nombre = state?.nombre?.trim() || "Grupo de cotización";

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(backPath)}
          sx={{
            mb: 2,
            color: "var(--color-fg-default-secondary)",
            textTransform: "none",
            "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
          }}
        >
          Volver al marketplace
        </Button>

        <Box
          sx={[
            pageHeaderSx,
            {
              backgroundColor: "var(--color-bg-default-primary)",
              borderRadius: 3,
              p: 3,
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Groups
                sx={{ color: "var(--color-fg-default-secondary)", fontSize: 28 }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-fg-default-primary)",
                }}
              >
                {nombre}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Contexto del grupo{id ? ` · ID ${id}` : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            backgroundColor: "var(--color-bg-default-primary)",
            border: "1px solid var(--color-border-default-primary)",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Estás en el contexto del grupo. La oferta y el detalle operativo a
            nivel grupo se implementarán en una siguiente historia.
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
};

export default FacturaGrupoFactoringDetalle;
