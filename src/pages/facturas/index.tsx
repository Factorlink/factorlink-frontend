import { Box, Typography, useTheme, FormControl, Select, MenuItem, IconButton } from "@mui/material";
import { Description, KeyboardArrowDown, FileDownload } from "@mui/icons-material";
import Layout from "../../components/Layout";
import OperationsTabs from "../../components/Dashboard/OperationsTabs";

const invoicesData = [
  {
    folio: "58754",
    empresa: "Ecosalmon",
    rut: "76.894.458-6",
    fechaEmision: "28/08/2024",
    iva: "$611.800",
    monto: "$3.831.800",
  },
  {
    folio: "32147",
    empresa: "Servicios Gas SPA",
    rut: "72.556.245-2",
    fechaEmision: "15/07/2024",
    iva: "$254.456",
    monto: "$1.593.700",
  },
  {
    folio: "66545",
    empresa: "Alcantara EIRL",
    rut: "70.321.500-1",
    fechaEmision: "02/05/2024",
    iva: "$942.097",
    monto: "$5.900.500",
  },
  {
    folio: "99782",
    empresa: "Comunicaciones S.A",
    rut: "70.845.245-5",
    fechaEmision: "05/04/2024",
    iva: "$404.860",
    monto: "$2.535.700",
  },
  {
    folio: "88745",
    empresa: "Factorlink S.A",
    rut: "74.555.245-1",
    fechaEmision: "25/04/2024",
    iva: "$254.456",
    monto: "$1.593.700",
  },
  {
    folio: "87541",
    empresa: "Cooperativa S.A",
    rut: "76.845.245-6",
    fechaEmision: "05/05/2024",
    iva: "$404.860",
    monto: "$2.535.700",
  },
  {
    folio: "32147",
    empresa: "Servicios Gas SPA",
    rut: "72.556.245-2",
    fechaEmision: "15/07/2024",
    iva: "$254.456",
    monto: "$1.593.700",
  },
  {
    folio: "66545",
    empresa: "Alcantara EIRL",
    rut: "70.321.500-1",
    fechaEmision: "02/05/2024",
    iva: "$942.097",
    monto: "$5.900.500",
  },
  {
    folio: "99782",
    empresa: "Comunicaciones S.A",
    rut: "70.845.245-5",
    fechaEmision: "05/04/2024",
    iva: "$404.860",
    monto: "$2.535.700",
  },
  {
    folio: "88745",
    empresa: "Factorlink S.A",
    rut: "74.555.245-1",
    fechaEmision: "25/04/2024",
    iva: "$254.456",
    monto: "$1.593.700",
  },
];

const tabLabels = [
  "Facturas pendientes a ceder",
  "Facturas por cotizar",
  "Compras",
  "Notas de Crédito",
  "Fact. Cedidas",
  "Retenciones",
];

const Facturas = () => {
  const theme = useTheme();

  return (
    <Layout>
      {/* Content Area */}
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Control de Facturas Banner */}
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
              Control de Facturas
            </Typography>
          </Box>

          
        </Box>

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
          <OperationsTabs tabLabels={tabLabels} data={invoicesData} />
        </Box>
      </Box>
    </Layout>
  );
};

export default Facturas;
