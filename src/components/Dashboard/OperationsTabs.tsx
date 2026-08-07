import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import { tableScrollSx, tableCompactSx } from "../../theme/layoutStyles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface OperationsRow {
  folio: string;
  empresa: string;
  rut: string;
  fechaEmision: string;
  iva: string;
  monto: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const headerCellSx = {
  fontWeight: 500,
  fontFamily: "var(--font-heading)",
  color: "var(--color-fg-default-secondary)",
};

const OperationsTabs = ({
  tabLabels,
  data,
}: {
  tabLabels: string[];
  data: OperationsRow[];
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid var(--color-border-default-primary)",
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          {tabLabels.map((label) => (
            <Tab key={label} iconPosition="start" label={label} />
          ))}
        </Tabs>
      </Box>

      {tabLabels.map((_, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          <TableContainer sx={tableScrollSx}>
            <Table sx={tableCompactSx}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Folio</TableCell>
                  <TableCell sx={headerCellSx}>Empresa</TableCell>
                  <TableCell sx={headerCellSx}>Fecha Cotización</TableCell>
                  <TableCell sx={headerCellSx}>Plazo a finaciar</TableCell>
                  <TableCell sx={headerCellSx}>$ Monto factura</TableCell>
                  <TableCell sx={headerCellSx}>Ofertas</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((invoice, idx) => (
                  <TableRow
                    key={`${invoice.folio}-${idx}`}
                    sx={{
                      "&:hover": {
                        backgroundColor:
                          "var(--color-bg-default-primary-hover)",
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
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          textTransform: "none",
                          borderRadius: "var(--radius-m)",
                          fontSize: "var(--font-size-xs)",
                          px: 2,
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={5}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </TabPanel>
      ))}
    </>
  );
};

export default OperationsTabs;
