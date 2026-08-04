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
      return <UnfoldMore sx={{ fontSize: 16, color: "var(--color-fg-default-tertiary)" }} />;
    }
    if (currentOrder === "ASC") {
      return <ArrowUpward sx={{ fontSize: 16, color: "var(--color-fg-accent-primary)" }} />;
    }
    return <ArrowDownward sx={{ fontSize: 16, color: "var(--color-fg-accent-primary)" }} />;
  };

  return (
    <TableCell
      sx={{
        fontWeight: 600,
        color: isActive ? "var(--color-fg-accent-primary)" : "var(--color-fg-default-secondary)",
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          backgroundColor: "var(--color-bg-default-tertiary)",
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
