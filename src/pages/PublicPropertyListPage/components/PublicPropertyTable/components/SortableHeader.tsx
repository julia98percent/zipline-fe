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
  const isActive = sortField === field;

  const direction = isActive && isAscending ? "asc" : "desc";

  return (
    <TableSortLabel
      active={isActive}
      direction={direction}
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
      {label} {unit}
    </TableSortLabel>
  );
};

export default SortableHeader;
