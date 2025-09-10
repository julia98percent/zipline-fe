"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ContractCategory, Contract } from "@/types/contract";
import { CONTRACT_STATUS_TYPES } from "@/constants/contract";
import { fetchCompletedContractsForDashboard } from "@/apis/contractService";
import Table, { ColumnConfig } from "@/components/Table";
import ContractCard from "@/app/(private)/contracts/_components/ContractCard";
import MobilePagination from "@/components/MobilePagination";
import { getPropertyTypeColors } from "@/constants/property";
import CircularProgress from "@/components/CircularProgress";

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

  const router = useRouter();
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
    router.push(`/contracts/${contractUid}`);
  };

  const handleContractClick = (contract: Contract) => {
    router.push(`/contracts/${contract.uid}`);
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] sm:w-[80vw] max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        완료된 계약 목록
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
                완료된 계약이 없습니다.
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
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
            noDataMessage="완료된 계약이 없습니다."
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompletedContractsModal;
