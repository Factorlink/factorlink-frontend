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

const headerCellSx = {
  fontWeight: 500,
  fontFamily: "var(--font-heading)",
  color: "var(--color-fg-default-secondary)",
  fontSize: "var(--font-size-xs)",
  py: 1,
};

const bodyCellSx = {
  fontSize: "var(--font-size-s)",
  py: 1.5,
  color: "var(--color-fg-default-primary)",
};

const DueInvoicesCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: "var(--radius-l)",
        p: 3,
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border-default-primary)",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Description sx={{ color: "var(--color-fg-default-secondary)" }} />
          <Typography
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 500,
              color: "var(--color-fg-default-primary)",
            }}
          >
            Facturas por vencer
          </Typography>
        </Box>
        <IconButton
          size="small"
          aria-label="Ver más"
          sx={{
            backgroundColor: "var(--color-bg-accent-primary)",
            color: "var(--color-fg-on-accent-primary)",
            borderRadius: "var(--radius-m)",
            "&:hover": {
              backgroundColor: "var(--color-bg-accent-primary-hover)",
            },
          }}
        >
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>#</TableCell>
              <TableCell sx={headerCellSx}>Deudor</TableCell>
              <TableCell sx={headerCellSx}>Factoring</TableCell>
              <TableCell sx={headerCellSx}>Retención</TableCell>
              <TableCell sx={headerCellSx}>Interés Día</TableCell>
              <TableCell sx={headerCellSx}>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dueInvoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "var(--color-bg-default-primary-hover)",
                  },
                }}
              >
                <TableCell sx={bodyCellSx}>{invoice.id}</TableCell>
                <TableCell
                  sx={{
                    ...bodyCellSx,
                    color: "var(--color-fg-accent-primary)",
                  }}
                >
                  {invoice.debtor}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellSx,
                    color: "var(--color-fg-accent-primary)",
                  }}
                >
                  {invoice.factoring}
                </TableCell>
                <TableCell sx={bodyCellSx}>{invoice.retention}</TableCell>
                <TableCell sx={bodyCellSx}>{invoice.interestDay}</TableCell>
                <TableCell sx={bodyCellSx}>{invoice.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DueInvoicesCard;
