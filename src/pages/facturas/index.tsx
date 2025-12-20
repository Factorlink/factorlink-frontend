import { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Pagination,
  useTheme,
} from "@mui/material";
import {
  Description,
  FileDownload,
  KeyboardArrowDown,
} from "@mui/icons-material";
import Layout from "../../components/Layout";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

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
  const [tabValue, setTabValue] = useState(1);
  const [page, setPage] = useState(1);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

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

          {/* Decorative circles */}
          <Box sx={{ position: "relative", width: 80, height: 60 }}>
            <Box
              sx={{
                position: "absolute",
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: "success.main",
                right: 0,
                top: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                right: 25,
                top: 15,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#FFB74D",
                right: 45,
                top: 25,
              }}
            />
          </Box>
        </Box>

        {/* Filters Row */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
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
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  minWidth: "auto",
                  px: 2,
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab
                  key={label}
                  icon={
                    index === 0 ? (
                      <Description sx={{ fontSize: "1.1rem" }} />
                    ) : undefined
                  }
                  iconPosition="start"
                  label={label}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {tabLabels.map((_, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Folio
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Empresa
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        RUT
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        Fecha Emisión
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        IVA
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        $ Monto factura
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoicesData.map((invoice, idx) => (
                      <TableRow key={`${invoice.folio}-${idx}`}>
                        <TableCell sx={{ fontSize: "0.9rem" }}>
                          {invoice.folio}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.9rem", color: "primary.main" }}
                        >
                          {invoice.empresa}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.9rem" }}>
                          {invoice.rut}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.9rem" }}>
                          {invoice.fechaEmision}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.9rem" }}>
                          {invoice.iva}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.9rem" }}>
                          {invoice.monto}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "success.main",
                              color: "white",
                              textTransform: "none",
                              borderRadius: 5,
                              fontSize: "0.8rem",
                              px: 2,
                              "&:hover": {
                                backgroundColor: "success.dark",
                              },
                            }}
                          >
                            Cotizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={5}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default Facturas;
