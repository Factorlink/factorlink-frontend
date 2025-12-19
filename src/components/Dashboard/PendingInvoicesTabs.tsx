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
} from "@mui/material";
import { Description } from "@mui/icons-material";

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

const pendingInvoices = [
  {
    folio: "58754",
    empresa: "Ecosalmon",
    rut: "76.894.458-6",
    fechaEmision: "02/05/2024",
    iva: "$611.800",
    monto: "$3.831.800",
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
    folio: "99782",
    empresa: "Comunicaciones S.A",
    rut: "70.845.245-5",
    fechaEmision: "05/04/2024",
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
];

const PendingInvoicesTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
            },
            "& .Mui-selected": {
              color: "text.primary",
            },
          }}
        >
          <Tab
            icon={<Description sx={{ fontSize: "1.2rem" }} />}
            iconPosition="start"
            label="Facturas pendientes a ceder"
          />
          <Tab label="Facturas por cotizar" />
        </Tabs>
      </Box>

      {/* Tab Panel 1 */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Folio
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Empresa
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  RUT
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Fecha Emisión
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  IVA
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  $ Monto factura
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingInvoices.map((invoice) => (
                <TableRow key={invoice.folio}>
                  <TableCell sx={{ fontSize: "0.9rem" }}>
                    {invoice.folio}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.9rem", color: "primary.main" }}>
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
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "success.main",
                        color: "success.main",
                        textTransform: "none",
                        borderRadius: 5,
                        fontSize: "0.8rem",
                        "&:hover": {
                          borderColor: "success.dark",
                          backgroundColor: "rgba(0, 217, 165, 0.08)",
                        },
                      }}
                    >
                      Ver ofertas
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab Panel 2 */}
      <TabPanel value={tabValue} index={1}>
        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
          No hay facturas por cotizar
        </Typography>
      </TabPanel>
    </Box>
  );
};

export default PendingInvoicesTabs;
