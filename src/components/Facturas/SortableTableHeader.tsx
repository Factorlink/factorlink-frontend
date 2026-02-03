import { TableCell, Box } from "@mui/material";
import { ArrowUpward, ArrowDownward, UnfoldMore } from "@mui/icons-material";

interface SortableTableHeaderProps {
  field: string;
  label: string;
  currentSortBy: string;
  currentOrder: string;
  onSort: (field: string) => void;
}

const SortableTableHeader = ({
  field,
  label,
  currentSortBy,
  currentOrder,
  onSort,
}: SortableTableHeaderProps) => {
  const isActive = currentSortBy === field;

  const getSortIcon = () => {
    if (!isActive) {
      return <UnfoldMore sx={{ fontSize: 16, color: "#94A3B8" }} />;
    }
    if (currentOrder === "ASC") {
      return <ArrowUpward sx={{ fontSize: 16, color: "#00BCD4" }} />;
    }
    return <ArrowDownward sx={{ fontSize: 16, color: "#00BCD4" }} />;
  };

  return (
    <TableCell
      sx={{
        fontWeight: 600,
        color: isActive ? "#00BCD4" : "#64748B",
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          backgroundColor: "#F1F5F9",
        },
      }}
      onClick={() => onSort(field)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {label}
        {getSortIcon()}
      </Box>
    </TableCell>
  );
};

export default SortableTableHeader;
