import React from "react";
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { Counsel } from "@ts/counsel";
import Table, { ColumnConfig } from "@components/Table";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface CounselListProps {
  counselTab: "request" | "latest";
  currentCounselList: Counsel[];
  counselLoading: boolean;
  handleCounselTabChange: (
    event: React.SyntheticEvent,
    newValue: "request" | "latest"
  ) => void;
  handleCounselClick: (counselId: number) => void;
}

const CounselList: React.FC<CounselListProps> = ({
  counselTab,
  currentCounselList,
  counselLoading,
  handleCounselTabChange,
  handleCounselClick,
}) => {
  // 컬럼 설정
  const columns: ColumnConfig<Counsel>[] = [
    {
      key: "customerName",
      label: "고객명",
      align: "left",
      render: (_, counsel) => counsel.customerName,
    },
    {
      key: "title",
      label: "제목",
      align: "left",
      render: (_, counsel) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {counsel.title}
          {counsel.completed && (
            <Chip
              label="완료"
              size="small"
              color="success"
              sx={{ fontSize: "10px", height: "18px" }}
            />
          )}
        </Box>
      ),
    },
    {
      key: "dueDate",
      label: "마감일",
      align: "left",
      render: (_, counsel) => formatDate(counsel.dueDate),
    },
  ];

  const tableData = currentCounselList.map((counsel) => ({
    id: counsel.counselUid,
    ...counsel,
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
            상담 목록
          </Typography>
        </Box>
        <Tabs
          value={counselTab}
          onChange={handleCounselTabChange}
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
                <p style={{ color: "inherit" }}>의뢰일 임박 순</p>
                <Tooltip title="2주 이내 의뢰 마감 예정인 상담이 표시됩니다.">
                  <HelpOutlineIcon
                    sx={{ fontSize: 16, color: "primary.main" }}
                  />
                </Tooltip>
              </div>
            }
            value="request"
            sx={{
              fontSize: "13px",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />

          <Tab
            label="최신 순"
            value="latest"
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
        {counselLoading ? (
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
            handleRowClick={(counsel) => handleCounselClick(counsel.counselUid)}
            pagination={false}
            noDataMessage="상담이 없습니다"
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

export default CounselList;
