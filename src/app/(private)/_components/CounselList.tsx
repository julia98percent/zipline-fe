import { Chip, Divider, Tooltip } from "@mui/material";
import { formatDate } from "@/utils/dateUtil";
import { Counsel } from "@/types/counsel";
import Table, { ColumnConfig } from "@/components/Table";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CircularProgress from "@/components/CircularProgress";

interface CounselListProps {
  counselTab: "request" | "latest";
  currentCounselList: Counsel[];
  counselLoading: boolean;
  handleCounselTabChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCounselClick: (counselId: number) => void;
}

const CounselList: React.FC<CounselListProps> = ({
  counselTab,
  currentCounselList,
  counselLoading,
  handleCounselTabChange,
  handleCounselClick,
}) => {
  const columns: ColumnConfig<Counsel>[] = [
    {
      key: "customerName",
      label: "고객명",
      align: "left",
      width: "25%",
      render: (_, counsel) => counsel.customerName,
    },
    {
      key: "title",
      label: "제목",
      align: "left",
      width: "50%",
      render: (_, counsel) => (
        <div className="flex items-center gap-2">
          {counsel.title}
          {counsel.completed && (
            <Chip
              label="완료"
              size="small"
              color="success"
              className="text-xs h-4"
            />
          )}
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "마감일",
      align: "left",
      width: "25%",
      render: (_, counsel) =>
        counsel.dueDate ? formatDate(counsel.dueDate) : "-",
    },
  ];

  const tableData = currentCounselList.map((counsel) => ({
    id: counsel.counselUid,
    ...counsel,
  }));

  const getNoDataMessage = () => {
    if (counselTab === "request") {
      return "마감 예정인 상담이 없습니다.";
    } else {
      return "최신 상담이 없습니다.";
    }
  };

  return (
    <div className="flex flex-col min-h-96 h-fit card">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h6 className="text-lg font-semibold text-primary">상담 목록</h6>
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`flex items-center gap-1 cursor-pointer ${
              counselTab === "request" ? "text-primary" : ""
            } ${counselTab === "request" ? "font-semibold" : ""}`}
            onClick={handleCounselTabChange}
            id="request"
          >
            의뢰일 임박 순
            <Tooltip title="2주 이내 의뢰 마감 예정인 상담이 표시됩니다.">
              <HelpOutlineIcon className="text-base color-inherit" />
            </Tooltip>
          </div>
          <Divider orientation="vertical" className="h-4 bg-neutral-300" />

          <div
            className={`flex items-center gap-1 cursor-pointer ${
              counselTab === "latest" ? "text-primary" : ""
            }  ${counselTab === "latest" ? "font-semibold" : ""}`}
            onClick={handleCounselTabChange}
            id="latest"
          >
            최신 순
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-auto">
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

export default CounselList;
