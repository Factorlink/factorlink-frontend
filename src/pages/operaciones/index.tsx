import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Description,
  KeyboardArrowDown,
  FileDownload,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import OperationsTabs from "../../components/Dashboard/OperationsTabs";
import { pageHeaderSx, paginationSelectSx, appContentSx } from "../../theme/layoutStyles";

const tabLabels = [
  "Marketplace",
  "Cotizador",
  "Gestión de cobranza",
  "Solicitar Liquidación",
];

const data = [
  {
    folio: "58754",
    empresa: "Ecosalmon",
    rut: "28/08/2024",
    fechaEmision: "32 días",
    iva: "$3.831.800",
    monto: "10",
  },
  {
    folio: "32147",
    empresa: "Servicios Gas SPA",
    rut: "15/07/2024",
    fechaEmision: "10",
    iva: "$1.593.700",
    monto: "8",
  },
];

const Operaciones = () => {
  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box
          sx={[
            pageHeaderSx,
            {
              background:
                "linear-gradient(135deg, var(--color-bg-neutral-primary) 0%, var(--color-bg-accent-primary) 100%)",
              borderRadius: "var(--radius-l)",
              p: 2.5,
              position: "relative",
              overflow: "hidden",
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <Description
              sx={{
                color: "var(--color-fg-success-primary)",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                color: "var(--color-fg-on-neutral-primary)",
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-l)",
              }}
            >
              Operaciones/Marketplace
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-primary)",
            borderRadius: "var(--radius-l)",
            p: 3,
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--color-border-default-primary)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl size="small" sx={[paginationSelectSx, { minWidth: { xs: 160, sm: 200 } }]}>
              <Select
                defaultValue="fecha"
                IconComponent={KeyboardArrowDown}
                sx={{ borderRadius: "var(--radius-m)" }}
              >
                <MenuItem value="fecha">01/08/2023 - 29/08/2024</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
              <Select
                defaultValue="filtro"
                IconComponent={KeyboardArrowDown}
                sx={{ borderRadius: "var(--radius-m)" }}
              >
                <MenuItem value="filtro">Filtro</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 140 } }}>
              <Select
                defaultValue="condicional"
                IconComponent={KeyboardArrowDown}
                sx={{ borderRadius: "var(--radius-m)" }}
              >
                <MenuItem value="condicional">Condicional</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              aria-label="Descargar"
              sx={{
                backgroundColor: "var(--color-bg-accent-primary)",
                color: "var(--color-fg-on-accent-primary)",
                borderRadius: "var(--radius-m)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-accent-primary-hover)",
                },
              }}
            >
              <FileDownload />
            </IconButton>
          </Box>

          <OperationsTabs tabLabels={tabLabels} data={data} />
        </Box>
      </Box>
    </Layout>
  );
};

export default Operaciones;
