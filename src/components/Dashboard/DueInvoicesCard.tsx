import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Description, ArrowForward } from "@mui/icons-material";

const dueInvoices = [
  {
    id: "10456",
    debtor: "Copec",
    factoring: "Eurocapital",
    retention: "$387.900",
    interestDay: "$3.879",
    date: "21/08/2024",
  },
  {
    id: "08532",
    debtor: "Equans",
    factoring: "Xepelin",
    retention: "$420.000",
    interestDay: "$4.200",
    date: "21/08/2024",
  },
  {
    id: "56789",
    debtor: "Copesa",
    factoring: "Eurocapital",
    retention: "$387.900",
    interestDay: "$3.879",
    date: "21/08/2024",
  },
  {
    id: "33547",
    debtor: "Los Molles",
    factoring: "Xepelin",
    retention: "$420.000",
    interestDay: "$4.200",
    date: "21/08/2024",
  },
  {
    id: "99874",
    debtor: "Frutesa",
    factoring: "Eurocapital",
    retention: "$387.900",
    interestDay: "$3.879",
    date: "21/08/2024",
  },
];

const DueInvoicesCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Description sx={{ color: "text.secondary" }} />
          <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
            Facturas por vencer
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem", py: 1 }}
              >
                #
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem", py: 1 }}
              >
                Deudor
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem", py: 1 }}
              >
                Factoring
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem", py: 1 }}
              >
                Retención
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem", py: 1 }}
              >
                Interés Día
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.8rem", py: 1 }}
              >
                Fecha
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dueInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>
                  {invoice.id}
                </TableCell>
                <TableCell sx={{ fontSize: "0.85rem", py: 1.5, color: "primary.main" }}>
                  {invoice.debtor}
                </TableCell>
                <TableCell sx={{ fontSize: "0.85rem", py: 1.5, color: "primary.main" }}>
                  {invoice.factoring}
                </TableCell>
                <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>
                  {invoice.retention}
                </TableCell>
                <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>
                  {invoice.interestDay}
                </TableCell>
                <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>
                  {invoice.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DueInvoicesCard;
