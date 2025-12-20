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

const OperationsTabs = ({
  tabLabels,
  data,
}: {
  tabLabels: string[];
  data: any[];
}) => {
  const [tabValue, setTabValue] = useState(0);
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
    <>
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
          {tabLabels.map((label) => (
            <Tab key={label} iconPosition="start" label={label} />
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
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Folio
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Empresa
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Fecha Cotización
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Plazo a finaciar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                    $ Monto factura
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Ofertas
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((invoice, idx) => (
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
                        Ver ofertas
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
    </>
  );
};

export default OperationsTabs;
