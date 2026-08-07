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
import { tableScrollSx, tableCompactSx } from "../../theme/layoutStyles";

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

const headerCellSx = {
  fontWeight: 500,
  fontFamily: "var(--font-heading)",
  color: "var(--color-fg-default-secondary)",
};

const PendingInvoicesTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: "var(--radius-l)",
        p: 3,
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border-default-primary)",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid var(--color-border-default-primary)",
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            icon={
              <Description
                sx={{ fontSize: "1.2rem", color: "inherit" }}
              />
            }
            iconPosition="start"
            label="Facturas pendientes a ceder"
          />
          <Tab label="Facturas por cotizar" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer sx={tableScrollSx}>
          <Table sx={tableCompactSx}>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Folio</TableCell>
                <TableCell sx={headerCellSx}>Empresa</TableCell>
                <TableCell sx={headerCellSx}>RUT</TableCell>
                <TableCell sx={headerCellSx}>Fecha Emisión</TableCell>
                <TableCell sx={headerCellSx}>IVA</TableCell>
                <TableCell sx={headerCellSx}>$ Monto factura</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingInvoices.map((invoice) => (
                <TableRow
                  key={invoice.folio}
                  sx={{
                    "&:hover": {
                      backgroundColor: "var(--color-bg-default-primary-hover)",
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: "var(--font-size-s)" }}>
                    {invoice.folio}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "var(--font-size-s)",
                      color: "var(--color-fg-accent-primary)",
                    }}
                  >
                    {invoice.empresa}
                  </TableCell>
                  <TableCell sx={{ fontSize: "var(--font-size-s)" }}>
                    {invoice.rut}
                  </TableCell>
                  <TableCell sx={{ fontSize: "var(--font-size-s)" }}>
                    {invoice.fechaEmision}
                  </TableCell>
                  <TableCell sx={{ fontSize: "var(--font-size-s)" }}>
                    {invoice.iva}
                  </TableCell>
                  <TableCell sx={{ fontSize: "var(--font-size-s)" }}>
                    {invoice.monto}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        textTransform: "none",
                        borderRadius: "var(--radius-m)",
                        fontSize: "var(--font-size-xs)",
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

      <TabPanel value={tabValue} index={1}>
        <Typography
          sx={{
            color: "var(--color-fg-default-secondary)",
            textAlign: "center",
            py: 4,
          }}
        >
          No hay facturas por cotizar
        </Typography>
      </TabPanel>
    </Box>
  );
};

export default PendingInvoicesTabs;
