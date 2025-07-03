import { Modal, Box, Typography, Chip } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { fetchRecentContractsForDashboard } from "@apis/contractService";
import { Contract } from "@ts/contract";
import Table, { ColumnConfig } from "@components/Table";

interface RecentContractsModalProps {
  open: boolean;
  onClose: () => void;
}

const RecentContractsModal = ({ open, onClose }: RecentContractsModalProps) => {
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        const result = await fetchRecentContractsForDashboard(
          pageNum,
          rowsPerPage
        );
        setContracts(result.contracts);
        setTotalCount(result.totalElements);
      } catch (error) {
        console.error("Failed to fetch recent contracts:", error);
        setContracts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    if (open) {
      fetchData(page);
    }
  }, [open, page, fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

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

  // 컬럼 설정
  const columns: ColumnConfig<Contract>[] = [
    {
      key: "lessorOrSellerNames",
      label: "임대/매도인",
      align: "center",
      render: (_, contract) => {
        return Array.isArray(contract.lessorOrSellerNames)
          ? contract.lessorOrSellerNames.length === 0
            ? "-"
            : contract.lessorOrSellerNames.length === 1
            ? contract.lessorOrSellerNames[0]
            : `${contract.lessorOrSellerNames[0]} 외 ${
                contract.lessorOrSellerNames.length - 1
              }명`
          : "-";
      },
    },
    {
      key: "lesseeOrBuyerNames",
      label: "임차/매수인",
      align: "center",
      render: (_, contract) => {
        return Array.isArray(contract.lesseeOrBuyerNames)
          ? contract.lesseeOrBuyerNames.length === 0
            ? "-"
            : contract.lesseeOrBuyerNames.length === 1
            ? contract.lesseeOrBuyerNames[0]
            : `${contract.lesseeOrBuyerNames[0]} 외 ${
                contract.lesseeOrBuyerNames.length - 1
              }명`
          : "-";
      },
    },
    {
      key: "address",
      label: "주소",
      align: "center",
      render: (_, contract) => contract.address ?? "-",
    },
    {
      key: "category",
      label: "계약 카테고리",
      align: "center",
      render: (_, contract) => {
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
        if (!contract.category || !categoryKoreanMap[contract.category])
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
      },
    },
    {
      key: "contractDate",
      label: "계약일",
      align: "center",
      render: (_, contract) => contract.contractDate ?? "-",
    },
    {
      key: "contractStartDate",
      label: "계약 시작일",
      align: "center",
      render: (_, contract) => contract.contractStartDate ?? "-",
    },
    {
      key: "contractEndDate",
      label: "계약 종료일",
      align: "center",
      render: (_, contract) => contract.contractEndDate ?? "-",
    },
    {
      key: "status",
      label: "상태",
      align: "center",
      render: (_, contract) => {
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
      },
    },
  ];

  // 테이블 데이터 변환 (uid를 id로 매핑)
  const tableData = contracts.map((contract) => ({
    id: contract.uid,
    ...contract,
  }));

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
        <Table
          columns={columns}
          bodyList={tableData}
          handleRowClick={(contract) => {
            navigate(`/contracts/${contract.uid}`);
            onClose();
          }}
          pagination={true}
          totalElements={totalCount}
          page={page}
          handleChangePage={(_, newPage) => handlePageChange(newPage)}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={(e) =>
            handleRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[10, 25, 50]}
          isLoading={loading}
          noDataMessage="계약 데이터가 없습니다"
        />
      </Box>
    </Modal>
  );
};

export default RecentContractsModal;
