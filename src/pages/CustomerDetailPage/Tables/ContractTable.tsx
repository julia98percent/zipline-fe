import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TablePagination,
} from "@mui/material";

interface ContractTableProps {
  contractList: Contract[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading: boolean;
}

export interface Contract {
  uid: number;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  category: string | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
  address: string;
}

const CONTRACT_STATUS_TYPES = [
  { value: "LISTED", name: "매물 등록", color: "default" },
  { value: "NEGOTIATING", name: "협상 중", color: "info" },
  { value: "INTENT_SIGNED", name: "가계약", color: "warning" },
  { value: "CANCELLED", name: "계약 취소", color: "error" },
  { value: "CONTRACTED", name: "계약 체결", color: "success" },
  { value: "IN_PROGRESS", name: "계약 진행 중", color: "primary" },
  { value: "PAID_COMPLETE", name: "잔금 지급 완료", color: "secondary" },
  { value: "REGISTERED", name: "등기 완료", color: "success" },
  { value: "MOVED_IN", name: "입주 완료", color: "success" },
  { value: "TERMINATED", name: "계약 해지", color: "error" },
];

const PROPERTY_TYPES = [
  { value: "SALE", name: "매매", color: "#4caf50" },
  { value: "DEPOSIT", name: "전세", color: "#2196f3" },
  { value: "MONTHLY", name: "월세", color: "#ff9800" },
];

function ContractTable({
  contractList,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading,
}: ContractTableProps) {
  const getStatusChip = (status: string) => {
    const statusInfo = CONTRACT_STATUS_TYPES.find(
      (item) => item.value === status
    );
    if (!statusInfo) return status;

    const getColor = (color: string) => {
      switch (color) {
        case "primary":
          return "#1976d2";
        case "success":
          return "#2e7d32";
        case "error":
          return "#d32f2f";
        case "warning":
          return "#ed6c02";
        case "info":
          return "#0288d1";
        case "secondary":
          return "#9c27b0";
        default:
          return "#999";
      }
    };

    return (
      <Chip
        label={statusInfo.name}
        variant="outlined"
        sx={{
          color: getColor(statusInfo.color),
          borderColor: getColor(statusInfo.color),
          fontWeight: 500,
          height: 28,
          fontSize: 13,
        }}
      />
    );
  };

  const getCategoryChip = (category: string | null) => {
    if (!category || category === "null") return "-";

    const typeInfo = PROPERTY_TYPES.find((type) => type.value === category);
    if (!typeInfo) return category;

    return (
      <Chip
        label={typeInfo.name}
        variant="outlined"
        sx={{
          color: typeInfo.color,
          borderColor: typeInfo.color,
          fontWeight: 500,
          height: 28,
          fontSize: 13,
          backgroundColor: `${typeInfo.color}10`,
        }}
      />
    );
  };

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>계약 카테고리</TableCell>
              <TableCell>주소</TableCell>
              <TableCell>임대인/매도인</TableCell>
              <TableCell>임차인/매수인</TableCell>
              <TableCell>계약일</TableCell>
              <TableCell>계약 시작일</TableCell>
              <TableCell>계약 종료일</TableCell>
              <TableCell>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : contractList.length > 0 ? (
              contractList.map((contract) => (
                <TableRow key={contract.uid}>
                  <TableCell>
                    {getCategoryChip(contract.category) ?? "-"}
                  </TableCell>
                  <TableCell>{contract.address}</TableCell>
                  <TableCell>
                    {contract.lessorOrSellerNames.join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    {contract.lesseeOrBuyerNames.join(", ") || "-"}
                  </TableCell>
                  <TableCell>{contract.contractDate ?? "-"}</TableCell>
                  <TableCell>{contract.contractStartDate ?? "-"}</TableCell>
                  <TableCell>{contract.contractEndDate ?? "-"}</TableCell>
                  <TableCell>{getStatusChip(contract.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <div style={{ color: "#757575", fontSize: "1rem" }}>
                    등록된 계약이 없습니다
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          총 {totalCount}건
        </Typography>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}건 중 ${from}-${to}건`
          }
        />
      </Box>
    </Paper>
  );
}

export default ContractTable;
