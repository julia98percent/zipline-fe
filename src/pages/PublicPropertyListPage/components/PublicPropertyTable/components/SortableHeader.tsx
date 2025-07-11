import { TableSortLabel } from "@mui/material";

interface Props {
  field: string;
  label: string;
  unit?: string;
  sortField?: string;
  isAscending?: boolean;
  onSort: (field: string) => void;
}

const SortableHeader = ({
  field,
  label,
  unit = "",
  sortField,
  isAscending,
  onSort,
}: Props) => {
  const getSortDirection = (field: string) => {
    return sortFields[field] || false;
  };

  const getSortIcon = (field: string) => {
    const direction = getSortDirection(field);
    if (!direction) return null;
    return direction === "ASC" ? "↑" : "↓";
  };

  return (
    <TableSortLabel
      active={!!getSortDirection(field)}
      direction={getSortDirection(field) === "ASC" ? "asc" : "desc"}
      onClick={() => onSort(field)}
      sx={{
        "&.MuiTableSortLabel-root": {
          color: "text.primary",
          "&:hover": {
            color: "primary.main",
          },
        },
        "&.Mui-active": {
          color: "primary.main",
          fontWeight: "bold",
        },
        "& .MuiTableSortLabel-icon": {
          opacity: 0.5,
          "&:hover": {
            opacity: 1,
          },
        },
      }}
    >
      {label} {unit} {getSortIcon(field)}
    </TableSortLabel>
  );
};

export default SortableHeader;
