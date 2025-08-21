import { Modal, Box, Typography, Chip, useMediaQuery } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CONTRACT_STATUS_TYPES } from "@constants/contract";
import { fetchRecentContractsForDashboard } from "@apis/contractService";
import { Contract } from "@ts/contract";
import Table, { ColumnConfig } from "@components/Table";
import ContractCard from "@pages/ContractListPage/ContractCard/ContractCard";
import MobilePagination from "@components/MobilePagination";
import { getPropertyTypeColors } from "@constants/property";

interface RecentContractsModalProps {
  open: boolean;
  onClose: () => void;
}

const RecentContractsModal = ({ open, onClose }: RecentContractsModalProps) => {
  const navigate = useNavigate();
  const isSmallModal = useMediaQuery("(max-width: 1200px)");

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

  const handleContractClick = (contract: Contract) => {
    navigate(`/contracts/${contract.uid}`);
    onClose();
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

        if (!contract.category || !categoryKoreanMap[contract.category])
          return "-";

        const colors = getPropertyTypeColors(contract.category);

        return (
          <Chip
            label={categoryKoreanMap[contract.category]}
            className="font-medium h-6 text-xs"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
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
            className="font-medium h-7 text-xs"
            style={{
              color: getColor(statusInfo.color),
              borderColor: getColor(statusInfo.color),
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
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-4xl bg-gray-100 shadow-2xl p-6 rounded-lg max-h-4/5 overflow-auto">
        <Typography className="font-bold text-primary text-xl mb-4">
          최근 계약 목록
        </Typography>

        {isSmallModal ? (
          <Box>
            {loading ? (
              <Box className="text-center py-8">로딩 중...</Box>
            ) : contracts.length === 0 ? (
              <Box className="text-center py-8 text-gray-500">
                계약 데이터가 없습니다
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
            isLoading={loading}
            noDataMessage="계약 데이터가 없습니다"
          />
        )}
      </Box>
    </Modal>
  );
};

export default RecentContractsModal;
