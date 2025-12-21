import {
  Box,
  useTheme,
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
  const theme = useTheme();
  return (
    <Layout>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Operaciones Banner */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: 3,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Description sx={{ color: "success.main", fontSize: "1.5rem" }} />
            <Typography
              sx={{
                color: "common.white",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
            >
              Operaciones/Marketplace
            </Typography>
          </Box>
        </Box>

        {/* Operaciones Content */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Filters Row */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                defaultValue="fecha"
                IconComponent={KeyboardArrowDown}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              >
                <MenuItem value="fecha">01/08/2023 - 29/08/2024</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                defaultValue="filtro"
                IconComponent={KeyboardArrowDown}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              >
                <MenuItem value="filtro">Filtro</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                defaultValue="condicional"
                IconComponent={KeyboardArrowDown}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                }}
              >
                <MenuItem value="condicional">Condicional</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <FileDownload />
            </IconButton>
          </Box>

          {/* Tabs */}
          <OperationsTabs tabLabels={tabLabels} data={data} />
        </Box>
      </Box>
    </Layout>
  );
};

export default Operaciones;
