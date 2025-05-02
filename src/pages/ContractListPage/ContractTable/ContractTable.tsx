import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { ContractItem } from "../ContractListPage";
import { Chip } from "@mui/material";

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
const categoryKoreanMap: Record<string, string> = {
  SALE: "매매",
  DEPOSIT: "전세",
  MONTHLY: "월세",
};

interface Props {
  contractList: ContractItem[];
  onRowClick?: (contract: ContractItem) => void;
}

const ContractTable = ({ contractList, onRowClick }: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedContracts = contractList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getColor = (color: string) => {
    switch (color) {
      case "primary":
        return "#1976d2"; // 파랑
      case "success":
        return "#2e7d32"; // 초록
      case "error":
        return "#d32f2f"; // 빨강
      case "warning":
        return "#ed6c02"; // 주황
      case "info":
        return "#0288d1"; // 하늘
      case "secondary":
        return "#9c27b0"; // 보라
      default:
        return "#999"; // 회색
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
    if (!category || category === "null") {
      return "-";
    }
  
    const label = categoryKoreanMap[category] ?? category;
  
    const colorMap: Record<string, string> = {
      SALE: "#4caf50",     // 매매 - 초록
      DEPOSIT: "#2196f3",  // 전세 - 파랑
      MONTHLY: "#ff9800",  // 월세 - 주황
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
  

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
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
              {displayedContracts.length > 0 ? (
                displayedContracts.map((contract) => (
                  <TableRow
                    key={contract.uid}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => onRowClick?.(contract)}
                  >
                    <TableCell align="center">
                      {contract.lessorOrSellerName}
                    </TableCell>
                    <TableCell align="center">
                      {contract.lesseeOrBuyerName ?? "-"}
                    </TableCell>
                    <TableCell align="center">{contract.address}</TableCell>
                    <TableCell align="center">
                    {getCategoryChip(contract.category)}
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
                      {getStatusChip(contract.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    계약 데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={contractList.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="페이지당 행"
        />
      </Paper>
    </Box>
  );
};

export default ContractTable;
