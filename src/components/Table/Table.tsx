import {
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress,
  Table as MuiTable,
  TablePagination,
  SxProps,
  TableCellProps,
} from "@mui/material";

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
  headerList?: string[]; // 레거시 지원을 위해 유지
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
  pagination?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string | number;
}

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];
export const DEFAULT_ROWS_PER_PAGE = 25;

function Table<T extends RowData>({
  isLoading = false,
  columns,
  headerList, // 레거시 지원
  bodyList,
  handleRowClick,
  totalElements = bodyList?.length || 0,
  page = 0,
  handleChangePage,
  rowsPerPage = 25,
  handleChangeRowsPerPage,
  noDataMessage = "데이터가 없습니다.",
  sx,
  pagination = true,
  stickyHeader = false,
  maxHeight,
}: Props<T>) {
  // columns가 제공되면 우선 사용, 없으면 headerList 사용 (레거시 지원)
  const allColumns: ColumnConfig<T>[] =
    columns ||
    headerList?.map((header) => ({ key: header, label: header })) ||
    [];

  // visible 속성이 false인 컬럼은 제외
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
    <Paper
      sx={{
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        ...sx,
      }}
    >
      <TableContainer sx={{ maxHeight: maxHeight }}>
        <MuiTable stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {finalColumns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : bodyList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={finalColumns.length} align="center">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            ) : (
              bodyList.map((rowData: T, index: number) => (
                <TableRow
                  key={rowData.id}
                  hover
                  onClick={(event) => {
                    handleRowClick?.(rowData, index, event);
                  }}
                  sx={{ cursor: handleRowClick ? "pointer" : "default" }}
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
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}개 중 ${from}-${to}개`
          }
        />
      )}
    </Paper>
  );
}
export default Table;
