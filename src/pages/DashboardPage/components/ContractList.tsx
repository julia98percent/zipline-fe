import React, { useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@utils/dateUtil";
import { Contract } from "@ts/contract";
import Table, { ColumnConfig, RowData } from "@components/Table";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import dayjs from "dayjs";

interface ContractListProps {
  contractTab: "expiring" | "recent";
  currentContractList: Contract[];
  contractLoading: boolean;
  handleContractTabChange: (
    event: React.SyntheticEvent,
    newValue: "expiring" | "recent"
  ) => void;
}

const ContractList = ({
  contractTab,
  currentContractList,
  contractLoading,
  handleContractTabChange,
}: ContractListProps) => {
  const navigate = useNavigate();

  const handleRowClick = (rowData: RowData) => {
    navigate(`/contracts/${rowData.id}`);
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
    <Card className="flex flex-col rounded-md bg-white min-h-96 h-fit shadow-sm">
      <Box className="p-4 border-b border-gray-300">
        <Box className="flex items-center justify-between mb-2 ">
          <Typography variant="h6" className="font-semibold text-primary">
            계약 목록
          </Typography>
        </Box>
        <Tabs
          value={contractTab}
          onChange={handleContractTabChange}
          className="min-h-auto"
          sx={{
            "& .MuiTab-root": {
              minHeight: "32px",
              fontSize: "14px",
              padding: "6px 12px",
            },
          }}
        >
          <Tab
            className="text-sm"
            label={
              <div className="flex items-center gap-1">
                <p className="text-inherit">만료 예정 계약</p>
                <Tooltip title="6개월 이내 만료 예정인 계약이 표시됩니다.">
                  <HelpOutlineIcon className="text-inherit text-base" />
                </Tooltip>
              </div>
            }
            value="expiring"
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="최근 계약"
            value="recent"
            className="text-sm"
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        </Tabs>
      </Box>
      <Box className="flex-1 overflow-auto">
        {contractLoading ? (
          <Box className="flex justify-center items-center h-[200px]">
            <CircularProgress />
          </Box>
        ) : (
          <Table
            columns={columns}
            bodyList={tableData}
            handleRowClick={handleRowClick}
            pagination={false}
            noDataMessage={getNoDataMessage()}
            className="shadow-none!"
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
      </Box>
    </Card>
  );
};

export default ContractList;
