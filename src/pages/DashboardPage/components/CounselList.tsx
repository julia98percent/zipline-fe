import React from "react";
import { Box, Card, Typography, Tabs, Tab, Chip, Tooltip } from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { Counsel } from "@ts/counsel";
import Table, { ColumnConfig } from "@components/Table";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CircularProgress from "@components/CircularProgress";

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
        <Box className="flex items-center gap-2">
          {counsel.title}
          {counsel.completed && (
            <Chip
              label="완료"
              size="small"
              color="success"
              className="text-xs h-4"
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
    <Card className="flex flex-col shadow-sm rounded-md bg-white min-h-96 h-fit">
      <Box className="p-4 border-b border-gray-300">
        <Box className="flex items-center justify-between mb-2">
          <Typography variant="h6" className="font-semibold text-primary">
            상담 목록
          </Typography>
        </Box>
        <Tabs
          value={counselTab}
          onChange={handleCounselTabChange}
          className="min-h-auto"
          sx={{
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
                  <HelpOutlineIcon className="text-base color-inherit" />
                </Tooltip>
              </div>
            }
            value="request"
            className="text-sm"
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />

          <Tab
            label="최신 순"
            value="latest"
            className="text-sm"
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        </Tabs>
      </Box>
      <Box className="flex flex-1 overflow-auto">
        {counselLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <CircularProgress size={36} />
          </div>
        ) : (
          <Table
            columns={columns}
            bodyList={tableData}
            handleRowClick={(counsel) => handleCounselClick(counsel.counselUid)}
            pagination={false}
            noDataMessage="마감 예정인 상담이 없습니다."
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
              boxShadow: "none",
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default CounselList;
