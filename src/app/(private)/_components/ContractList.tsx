"use client";
import React, { useMemo } from "react";
import { Divider, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateUtil";
import { Contract } from "@/types/contract";
import Table, { ColumnConfig, RowData } from "@/components/Table";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import dayjs from "dayjs";
import CircularProgress from "@/components/CircularProgress";

interface ContractListProps {
  contractTab: "expiring" | "recent";
  currentContractList: Contract[];
  contractLoading: boolean;
  handleContractTabChange: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ContractList = ({
  contractTab,
  currentContractList,
  contractLoading,
  handleContractTabChange,
}: ContractListProps) => {
  const router = useRouter();

  const handleRowClick = (rowData: RowData) => {
    router.push(`/contracts/${rowData.id}`);
  };

  const filteredAndSortedContracts = useMemo(() => {
    if (!currentContractList || currentContractList.length === 0) {
      return [];
    }

    let processedContracts = [...currentContractList];

    if (contractTab === "expiring") {
      const sixMonthsFromNow = dayjs().add(6, "month");

      processedContracts = processedContracts
        .filter((contract) => {
          if (!contract.contractEndDate) return false;

          const endDate = dayjs(contract.contractEndDate);
          const now = dayjs();

          return endDate.isAfter(now) && endDate.isBefore(sixMonthsFromNow);
        })
        .sort((a, b) => {
          if (!a.contractEndDate || !b.contractEndDate) return 0;
          return dayjs(a.contractEndDate).diff(dayjs(b.contractEndDate));
        });
    } else if (contractTab === "recent") {
      processedContracts = processedContracts.sort((a, b) => {
        if (!a.contractDate && !b.contractDate) return 0;
        if (!a.contractDate) return 1;
        if (!b.contractDate) return -1;

        return dayjs(b.contractDate).diff(dayjs(a.contractDate));
      });
    }

    return processedContracts;
  }, [currentContractList, contractTab]);

  const columns: ColumnConfig<Contract>[] = [
    {
      key: "lessorOrSellerNames",
      label: "임대인/매도인",
      align: "left",
      render: (_, contract) => contract.lessorOrSellerNames?.join(", ") || "-",
    },
    {
      key: "lesseeOrBuyerNames",
      label: "임차인/매수인",
      align: "left",
      render: (_, contract) => contract.lesseeOrBuyerNames?.join(", ") || "-",
    },
    {
      key: "contractEndDate",
      label: contractTab === "expiring" ? "종료일" : "계약일",
      align: "left",
      render: (_, contract) => {
        if (contractTab === "expiring") {
          return contract.contractEndDate
            ? formatDate(contract.contractEndDate)
            : "-";
        } else {
          return contract.contractDate
            ? formatDate(contract.contractDate)
            : "-";
        }
      },
    },
  ];

  // 테이블 데이터 변환 (uid를 id로 매핑)
  const tableData = filteredAndSortedContracts.map((contract) => ({
    id: contract.uid,
    ...contract,
  }));

  const getNoDataMessage = () => {
    if (contractTab === "expiring") {
      return "6개월 이내 만료 예정인 계약이 없습니다.";
    } else {
      return "최근 계약이 없습니다.";
    }
  };

  return (
    <div className="flex flex-col min-h-96 h-fit card">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h6 className="text-lg font-semibold text-primary">계약 목록</h6>
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`flex items-center gap-1 cursor-pointer ${
              contractTab === "expiring" ? "text-primary" : "text-neutral-900"
            } ${contractTab === "expiring" ? "font-semibold" : ""}`}
            onClick={handleContractTabChange}
            id="expiring"
          >
            만료 예정 계약
            <Tooltip title="6개월 이내 만료 예정인 계약이 표시됩니다.">
              <HelpOutlineIcon className="text-inherit text-base" />
            </Tooltip>
          </div>
          <Divider orientation="vertical" className="h-4 bg-neutral-300" />

          <div
            className={`flex items-center gap-1 cursor-pointer ${
              contractTab === "recent" ? "text-primary" : "text-neutral-900"
            } ${contractTab === "recent" ? "font-semibold" : ""}`}
            id="recent"
            onClick={handleContractTabChange}
          >
            최근 계약
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-auto">
        {contractLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <CircularProgress size={36} />
          </div>
        ) : (
          <Table
            columns={columns}
            bodyList={tableData}
            handleRowClick={handleRowClick}
            pagination={false}
            noDataMessage={getNoDataMessage()}
            className="shadow-none! w-full"
            sx={{
              "& .MuiTableCell-head": {
                fontSize: "13px",
                fontWeight: 600,
                padding: "8px 16px",
              },
              "& .MuiTableCell-body": {
                fontSize: "12px",
                padding: "8px 16px",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContractList;
