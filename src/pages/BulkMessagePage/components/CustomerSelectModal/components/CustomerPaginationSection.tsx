import { TablePagination } from "@mui/material";

interface CustomerPaginationSectionProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomerPaginationSection({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: CustomerPaginationSectionProps) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      className="border-t border-gray-200"
      sx={{
        "& .MuiTablePagination-select": {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
      labelRowsPerPage="페이지당 고객 수"
      labelDisplayedRows={({ from, to, count }) =>
        `${count}명 중 ${from}-${to}명`
      }
    />
  );
}
