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
import { formatDate } from "@utils/dateUtil";
import { Contract } from "@ts/contract";
import Table, { ColumnConfig } from "@components/Table";
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
      return "6개월 이내 만료 예정인 계약이 없습니다";
    } else {
      return "최근 계약이 없습니다";
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "6px",
        backgroundColor: "#fff",
        minHeight: "400px",
        height: "fit-content",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#164f9e" }}>
            계약 목록
          </Typography>
        </Box>
        <Tabs
          value={contractTab}
          onChange={handleContractTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTab-root": {
              minHeight: "32px",
              fontSize: "14px",
              padding: "6px 12px",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
            },
          }}
        >
          <Tab
            label={
              <div className="flex items-center gap-1">
                <p style={{ color: "inherit" }}>만료 예정 계약</p>
                <Tooltip title="6개월 이내 만료 예정인 계약이 표시됩니다.">
                  <HelpOutlineIcon sx={{ fontSize: 16, color: "inherit" }} />
                </Tooltip>
              </div>
            }
            value="expiring"
            sx={{
              fontSize: "13px",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="최근 계약"
            value="recent"
            sx={{
              fontSize: "13px",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {contractLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table
            columns={columns}
            bodyList={tableData}
            pagination={false}
            noDataMessage={getNoDataMessage()}
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
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(22, 79, 158, 0.04)",
              },
              boxShadow: "none",
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default ContractList;
