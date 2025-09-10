"use client";

import {
  Dialog,
  DialogTitle,
  Chip,
  useMediaQuery,
  DialogContent,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CONTRACT_STATUS_TYPES } from "@/constants/contract";
import { fetchRecentContractsForDashboard } from "@/apis/contractService";
import { Contract } from "@/types/contract";
import Table, { ColumnConfig } from "@/components/Table";
import ContractCard from "@/app/(private)/contracts/_components/ContractCard";
import MobilePagination from "@/components/MobilePagination";
import { getPropertyTypeColors } from "@/constants/property";
import CircularProgress from "@/components/CircularProgress";

interface RecentContractsModalProps {
  open: boolean;
  onClose: () => void;
}

const RecentContractsModal = ({ open, onClose }: RecentContractsModalProps) => {
  const router = useRouter();
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
    router.push(`/contracts/${contract.uid}`);
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

  const tableData = contracts.map((contract) => ({
    id: contract.uid,
    ...contract,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] sm:w-[80vw] max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        최근 계약 고객
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 p-3 bg-neutral-100">
        {isSmallModal ? (
          <div className="h-full pb-4">
            {loading ? (
              <div className="flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : contracts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                계약 데이터가 없습니다.
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {contracts.map((contract) => (
                    <ContractCard
                      key={contract.uid}
                      contract={contract}
                      onRowClick={handleContractClick}
                    />
                  ))}
                </div>
                <MobilePagination
                  page={page}
                  totalElements={totalCount}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(_, newPage) => handlePageChange(newPage)}
                />
              </>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            bodyList={tableData}
            handleRowClick={(contract) => {
              router.push(`/contracts/${contract.uid}`);
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
            noDataMessage="계약 데이터가 없습니다."
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecentContractsModal;
