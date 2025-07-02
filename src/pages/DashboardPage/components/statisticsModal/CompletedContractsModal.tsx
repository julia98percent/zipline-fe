import { Modal, Box, Typography, Chip } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ContractCategory, Contract } from "@ts/contract";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { fetchCompletedContractsForDashboard } from "@apis/contractService";
import Table, { ColumnConfig } from "@components/Table";

interface CompletedContractsModalProps {
  open: boolean;
  onClose: () => void;
}

const CompletedContractsModal = ({
  open,
  onClose,
}: CompletedContractsModalProps) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    try {
      const response = await fetchCompletedContractsForDashboard(
        page,
        rowsPerPage
      );
      setContracts(response.contracts);
      setTotalCount(response.totalElements);
    } catch (error) {
      console.error("Failed to fetch completed contracts:", error);
      setContracts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [open, page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    const label =
      ContractCategory[category as keyof typeof ContractCategory] ?? category;
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

  // 컬럼 설정
  const columns: ColumnConfig<Contract>[] = [
    {
      key: "lessorOrSellerNames",
      label: "임대/매도인",
      align: "center",
      render: (_, contract) => contract.lessorOrSellerNames?.join(", ") || "-",
    },
    {
      key: "lesseeOrBuyerNames",
      label: "임차/매수인",
      align: "center",
      render: (_, contract) => contract.lesseeOrBuyerNames?.join(", ") || "-",
    },
    {
      key: "address",
      label: "주소",
      align: "center",
      render: (_, contract) => contract.address,
    },
    {
      key: "category",
      label: "계약 카테고리",
      align: "center",
      render: (_, contract) => getCategoryChip(contract.category),
    },
    {
      key: "contractDate",
      label: "계약일",
      align: "center",
      render: (_, contract) => formatDate(contract.contractDate),
    },
    {
      key: "contractStartDate",
      label: "계약 시작일",
      align: "center",
      render: (_, contract) => formatDate(contract.contractStartDate),
    },
    {
      key: "contractEndDate",
      label: "계약 종료일",
      align: "center",
      render: (_, contract) => formatDate(contract.contractEndDate),
    },
    {
      key: "status",
      label: "상태",
      align: "center",
      render: (_, contract) => getStatusChip(contract.status),
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
          완료된 계약 목록
        </Typography>
        <Table
          columns={columns}
          bodyList={tableData}
          handleRowClick={(contract) => handleRowClick(contract.uid)}
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
          noDataMessage="완료된 계약이 없습니다"
        />
      </Box>
    </Modal>
  );
};

export default CompletedContractsModal;
