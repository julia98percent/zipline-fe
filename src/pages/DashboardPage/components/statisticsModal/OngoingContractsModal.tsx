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
import { Contract } from "@ts/contract";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";

interface OngoingContractsModalProps {
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

const categoryKoreanMap: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
};

const OngoingContractsModal = ({
  open,
  onClose,
  contracts,
  loading,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: OngoingContractsModalProps) => {
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
      aria-labelledby="ongoing-contracts-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 1000,
          bgcolor: "#f5f5f5",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflow: "auto",
          padding: "24px",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, marginBottom: "16px" }}
        >
          진행중인 계약 목록
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
            }}
          >
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
                        진행중인 계약이 없습니다.
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
                          {contract.lessorOrSellerNames.join(", ") || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {contract.lesseeOrBuyerNames.join(", ") || "-"}
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

export default OngoingContractsModal;
