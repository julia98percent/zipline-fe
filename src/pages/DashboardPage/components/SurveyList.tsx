import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { formatDate } from "@utils/dateUtil";
import { PreCounsel } from "@ts/counsel";
import Table, { ColumnConfig } from "@components/Table";

interface SurveyListProps {
  surveyResponses: PreCounsel[];
  handleSurveyClick: (surveyResponseUid: number) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({
  surveyResponses,
  handleSurveyClick,
}) => {
  // 컬럼 설정
  const columns: ColumnConfig<PreCounsel>[] = [
    {
      key: "name",
      label: "이름",
      align: "left",
      render: (_, survey) => survey.name,
    },
    {
      key: "phoneNumber",
      label: "연락처",
      align: "left",
      render: (_, survey) => survey.phoneNumber,
    },
    {
      key: "submittedAt",
      label: "작성일",
      align: "left",
      render: (_, survey) => formatDate(survey.submittedAt),
    },
  ];

  // 테이블 데이터 변환 (surveyResponseUid를 id로 매핑)
  const tableData = Array.isArray(surveyResponses)
    ? surveyResponses.map((survey) => ({
        id: survey.surveyResponseUid,
        ...survey,
      }))
    : [];

  return (
    <Card
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        borderRadius: "6px",
        backgroundColor: "#fff",
        p: 2,
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, pb: 1, color: "#164f9e" }}
        >
          신규 설문
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Table
          columns={columns}
          bodyList={tableData}
          handleRowClick={(survey) =>
            handleSurveyClick(survey.surveyResponseUid)
          }
          pagination={false}
          noDataMessage="신규 설문이 없습니다"
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
      </Box>
    </Card>
  );
};

export default SurveyList;
