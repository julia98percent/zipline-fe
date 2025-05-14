import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Contract {
  uid: number;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  category: "SALE" | "DEPOSIT" | "MONTHLY" | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
  address: string;
}

interface CompletedContractsModalProps {
  open: boolean;
  onClose: () => void;
  contracts: Contract[];
  loading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
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
] as const;

const categoryKoreanMap: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
};

const CompletedContractsModal = ({
  open,
  onClose,
  contracts = [],
  loading,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: CompletedContractsModalProps) => {
  const navigate = useNavigate();

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

  const getStatusChip = (status: string) => {
    const statusInfo = CONTRACT_STATUS_TYPES.find(
      (item) => item.value === status
    );
    if (!statusInfo) return status;

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
    const label = categoryKoreanMap[category] ?? category;
    const colorMap: Record<string, string> = {
      SALE: "#4caf50",
      DEPOSIT: "#2196f3",
      MONTHLY: "#ff9800",
    };
    return (
      <Chip
        label={label}
        variant="outlined"
        sx={{
          color: colorMap[category],
          borderColor: colorMap[category],
          fontWeight: 500,
          height: 26,
          fontSize: 13,
        }}
      />
    );
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleRowClick = (contractUid: number) => {
    navigate(`/contracts/${contractUid}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="completed-contracts-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 1000,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          완료된 계약 목록
        </Typography>

        <Box sx={{ width: "100%", mt: "28px" }}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">임대/매도인</TableCell>
                    <TableCell align="center">임차/매수인</TableCell>
                    <TableCell align="center">주소</TableCell>
                    <TableCell align="center">계약 카테고리</TableCell>
                    <TableCell align="center">계약일</TableCell>
                    <TableCell align="center">계약 시작일</TableCell>
                    <TableCell align="center">계약 종료일</TableCell>
                    <TableCell align="center">상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : contracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        완료된 계약이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contracts.map((contract) => (
                      <TableRow
                        key={contract.uid}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(contract.uid)}
                      >
                        <TableCell align="center">
                          {contract.lessorOrSellerNames?.join(", ") || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {contract.lesseeOrBuyerNames?.join(", ") || "-"}
                        </TableCell>
                        <TableCell align="center">{contract.address}</TableCell>
                        <TableCell align="center">
                          {getCategoryChip(contract.category)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(contract.contractDate)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(contract.contractStartDate)}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(contract.contractEndDate)}
                        </TableCell>
                        <TableCell align="center">
                          {getStatusChip(contract.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => onPageChange(newPage)}
              onRowsPerPageChange={(e) =>
                onRowsPerPageChange(parseInt(e.target.value, 10))
              }
              rowsPerPageOptions={[10, 25, 50]}
              labelRowsPerPage="페이지당 행 수"
              labelDisplayedRows={({ from, to, count }) =>
                `${count}개 중 ${from}-${to}개`
              }
            />
          </Paper>
        </Box>
      </Box>
    </Modal>
  );
};

export default CompletedContractsModal;
