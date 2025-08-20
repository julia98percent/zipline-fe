import {
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Table as MuiTable,
  SxProps,
  TableCellProps,
} from "@mui/material";
import EnhancedPagination from "./EnhancedPagination";

export interface ColumnConfig<T = unknown> {
  key: string;
  label: string | React.ReactNode;
  align?: TableCellProps["align"];
  width?: string | number;
  minWidth?: string | number;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  visible?: boolean;
}

export interface RowData {
  id: string | number;
  [key: string]: unknown;
}

interface Props<T extends RowData> {
  isLoading?: boolean;
  columns?: ColumnConfig<T>[];
  bodyList: T[];
  handleRowClick?: (rowData: T, index: number, event: React.MouseEvent) => void;
  totalElements?: number;
  page?: number;
  handleChangePage?: (_: unknown, newPage: number) => void;
  rowsPerPage?: number;
  handleChangeRowsPerPage?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  noDataMessage?: string;
  sx?: SxProps;
  className?: string;
  pagination?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string | number;
  hidePaginationControls?: boolean;
}

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];
export const DEFAULT_ROWS_PER_PAGE = 25;

function Table<T extends RowData>({
  columns,
  bodyList,
  handleRowClick,
  totalElements = bodyList?.length || 0,
  page = 0,
  handleChangePage,
  rowsPerPage = 25,
  handleChangeRowsPerPage,
  noDataMessage = "데이터가 없습니다.",
  sx,
  className,
  pagination = true,
  stickyHeader = false,
  maxHeight,
  hidePaginationControls = false,
}: Props<T>) {
  const allColumns: ColumnConfig<T>[] = columns || [];

  const finalColumns: ColumnConfig<T>[] = allColumns.filter(
    (column) => column.visible !== false
  );

  const renderCell = (
    column: ColumnConfig<T>,
    rowData: T,
    index: number
  ): React.ReactNode => {
    if (column.render) {
      return column.render(rowData[column.key], rowData, index);
    }
    return rowData[column.key] as React.ReactNode;
  };

  return (
    <Paper className={`rounded-lg shadow-sm ${className || ""}`} sx={sx}>
      <TableContainer style={{ maxHeight: maxHeight }}>
        <MuiTable stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {finalColumns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={finalColumns.length} align="center">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            ) : (
              bodyList.map((rowData: T, index: number) => (
                <TableRow
                  key={rowData.id + `${index}`}
                  hover
                  onClick={(event) => {
                    handleRowClick?.(rowData, index, event);
                  }}
                  className={
                    handleRowClick ? "cursor-pointer" : "cursor-default"
                  }
                >
                  {finalColumns.map((column) => (
                    <TableCell key={column.key} align={column.align}>
                      {renderCell(column, rowData, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {pagination && handleChangePage && handleChangeRowsPerPage && (
        <EnhancedPagination
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          hidePaginationControls={hidePaginationControls}
        />
      )}
    </Paper>
  );
}
export default Table;
