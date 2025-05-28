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
} from "@mui/material";

interface RowData {
  id: string;
  [key: string]: React.ReactNode;
}

interface Props {
  isLoading?: boolean;
  headerList: string[];
  bodyList: RowData[];
  handleRowClick?: (id: string) => void;
  totalElements: number;
  page: number;
  handleChangePage?: (_: unknown, newPage: number) => void;
  rowsPerPage?: number;
  handleChangeRowsPerPage: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  noDataMessage?: string;
  sx?: SxProps;
}

function Table({
  isLoading = false,
  headerList,
  bodyList,
  handleRowClick,
  totalElements = bodyList?.length || 0,
  page,
  handleChangePage,
  rowsPerPage = 25,
  handleChangeRowsPerPage,
  noDataMessage = "데이터가 없습니다.",
  sx,
}: Props) {
  return (
    <Paper
      sx={{
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        ...sx,
      }}
    >
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow>
              {headerList.map((name) => (
                <TableCell key={name}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : bodyList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            ) : (
              bodyList.map(({ id, ...rowData }: RowData, index: number) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick?.(id)}
                  sx={{ cursor: handleRowClick ? "pointer" : "default" }}
                >
                  {Object.keys(rowData).map((key) => (
                    <TableCell key={key}>{rowData[key]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {handleChangePage && (
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
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
