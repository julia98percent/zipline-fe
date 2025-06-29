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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";

interface Contract {
  uid: number;
  lessorOrSellerNames: string[];
  lesseeOrBuyerNames: string[];
  category: "SALE" | "DEPOSIT" | "MONTHLY" | null;
  contractDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  status: string;
  address?: string;
}

interface RecentContractsModalProps {
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

const RecentContractsModal = ({
  open,
  onClose,
  contracts,
  loading,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: RecentContractsModalProps) => {
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="recent-contracts-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
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
          최근 계약 목록
        </Typography>
        <Paper
          sx={{
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
            overflow: "hidden",
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
                    <TableCell colSpan={8} align="center">
                      불러오는 중...
                    </TableCell>
                  </TableRow>
                ) : contracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      계약 데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  contracts.map((contract) => (
                    <TableRow
                      key={contract.uid}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/contracts/${contract.uid}`);
                        onClose();
                      }}
                    >
                      <TableCell align="center">
                        {Array.isArray(contract.lessorOrSellerNames)
                          ? contract.lessorOrSellerNames.length === 0
                            ? "-"
                            : contract.lessorOrSellerNames.length === 1
                            ? contract.lessorOrSellerNames[0]
                            : `${contract.lessorOrSellerNames[0]} 외 ${
                                contract.lessorOrSellerNames.length - 1
                              }명`
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {Array.isArray(contract.lesseeOrBuyerNames)
                          ? contract.lesseeOrBuyerNames.length === 0
                            ? "-"
                            : contract.lesseeOrBuyerNames.length === 1
                            ? contract.lesseeOrBuyerNames[0]
                            : `${contract.lesseeOrBuyerNames[0]} 외 ${
                                contract.lesseeOrBuyerNames.length - 1
                              }명`
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {contract.address ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {(() => {
                          const categoryKoreanMap: Record<string, string> = {
                            SALE: "매매",
                            DEPOSIT: "전세",
                            MONTHLY: "월세",
                          };
                          const colorMap: Record<string, string> = {
                            SALE: "#4caf50",
                            DEPOSIT: "#2196f3",
                            MONTHLY: "#ff9800",
                          };
                          if (
                            !contract.category ||
                            !categoryKoreanMap[contract.category]
                          )
                            return "-";
                          return (
                            <Chip
                              label={categoryKoreanMap[contract.category]}
                              variant="outlined"
                              sx={{
                                color: colorMap[contract.category],
                                borderColor: colorMap[contract.category],
                                fontWeight: 500,
                                height: 26,
                                fontSize: 13,
                              }}
                            />
                          );
                        })()}
                      </TableCell>
                      <TableCell align="center">
                        {contract.contractDate ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {contract.contractStartDate ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {contract.contractEndDate ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {(() => {
                          const statusInfo = CONTRACT_STATUS_TYPES.find(
                            (item) => item.value === contract.status
                          );
                          return statusInfo ? (
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
                          ) : (
                            contract.status
                          );
                        })()}
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
            sx={{
              borderTop: "1px solid rgba(224, 224, 224, 1)",
            }}
          />
        </Paper>
      </Box>
    </Modal>
  );
};

export default RecentContractsModal;
