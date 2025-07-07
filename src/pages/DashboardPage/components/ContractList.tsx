import React from "react";
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
  // 컬럼 설정
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
      label: "종료일",
      align: "left",
      render: (_, contract) =>
        contract.contractEndDate ? formatDate(contract.contractEndDate) : "-",
    },
  ];

  // 테이블 데이터 변환 (uid를 id로 매핑)
  const tableData = currentContractList.map((contract) => ({
    id: contract.uid,
    ...contract,
  }));

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        borderRadius: "6px",
        backgroundColor: "#fff",
        minHeight: "400px",
        height: "fit-content",
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
                  <HelpOutlineIcon
                    sx={{ fontSize: 16, color: "primary.main" }}
                  />
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
            noDataMessage="계약이 없습니다"
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
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default ContractList;
