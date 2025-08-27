import React from "react";
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
    <div className="flex-1 flex flex-col card">
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <h6 className="text-lg font-semibold text-primary">신규 사전 상담</h6>
      </div>
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          bodyList={tableData}
          handleRowClick={(survey) =>
            handleSurveyClick(survey.surveyResponseUid)
          }
          pagination={false}
          noDataMessage="신규 사전 상담이 없습니다."
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
      </div>
    </div>
  );
};

export default SurveyList;
