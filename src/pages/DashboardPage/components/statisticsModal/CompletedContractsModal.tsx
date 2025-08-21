import { Modal, Box, Typography, Chip, useMediaQuery } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ContractCategory, Contract } from "@ts/contract";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { fetchCompletedContractsForDashboard } from "@apis/contractService";
import Table, { ColumnConfig } from "@components/Table";
import ContractCard from "@pages/ContractListPage/ContractCard/ContractCard";
import MobilePagination from "@components/MobilePagination";
import { getPropertyTypeColors } from "@constants/property";

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
  const isSmallModal = useMediaQuery("(max-width: 1200px)");

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
        className="font-medium h-7 text-xs"
        style={{
          color: getColor(statusInfo.color),
          borderColor: getColor(statusInfo.color),
        }}
      />
    );
  };

  const getCategoryChip = (category: string | null) => {
    if (!category || category === "null") return "-";
    const label =
      ContractCategory[category as keyof typeof ContractCategory] ?? category;
    const colors = getPropertyTypeColors(category);

    return (
      <Chip
        label={label}
        className="font-medium h-6 text-xs"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
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

  const handleContractClick = (contract: Contract) => {
    navigate(`/contracts/${contract.uid}`);
    onClose();
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
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-4xl bg-gray-100 shadow-2xl p-6 rounded-lg max-h-4/5 overflow-auto">
        <Typography className="font-bold text-primary text-xl mb-4">
          완료된 계약 목록
        </Typography>
        
        {isSmallModal ? (
          /* 작은 모달에서는 카드 컴포넌트 사용 */
          <Box>
            {loading ? (
              <Box className="text-center py-8">로딩 중...</Box>
            ) : contracts.length === 0 ? (
              <Box className="text-center py-8 text-gray-500">
                완료된 계약이 없습니다
              </Box>
            ) : (
              <>
                <Box className="space-y-4 max-h-96 overflow-y-auto">
                  {contracts.map((contract) => (
                    <ContractCard
                      key={contract.uid}
                      contract={contract}
                      onRowClick={handleContractClick}
                    />
                  ))}
                </Box>
                <MobilePagination
                  page={page}
                  totalElements={totalCount}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(_, newPage) => handlePageChange(newPage)}
                />
              </>
            )}
          </Box>
        ) : (
          /* 큰 모달에서는 테이블 사용 */
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
            isLoading={loading}
            noDataMessage="완료된 계약이 없습니다"
          />
        )}
      </Box>
    </Modal>
  );
};

export default CompletedContractsModal;
