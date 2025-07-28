import Table, { ColumnConfig } from "@components/Table/Table";
import dayjs from "dayjs";
import { PreCounsel } from "@ts/counsel";

interface Props {
  counsels: PreCounsel[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (surveyResponseUid: number) => void;
}

const PreCounselTable = ({
  counsels,
  isLoading,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}: Props) => {
  const columns: ColumnConfig<PreCounsel>[] = [
    {
      key: "name",
      label: "이름",
      render: (value) => value as string,
    },
    {
      key: "phoneNumber",
      label: "전화번호",
      render: (value) => value as string,
    },
    {
      key: "submittedAt",
      label: "상담 요청일",
      render: (value) => dayjs(value as string).format("YYYY-MM-DD HH:mm"),
    },
  ];

  return (
    <Table
      isLoading={isLoading}
      columns={columns}
      bodyList={counsels.map((counsel) => ({
        ...counsel,
        id: counsel.surveyResponseUid,
      }))}
      handleRowClick={(rowData) =>
        onRowClick(rowData.surveyResponseUid as number)
      }
      totalElements={totalElements}
      page={page}
      handleChangePage={onPageChange}
      rowsPerPage={rowsPerPage}
      handleChangeRowsPerPage={onRowsPerPageChange}
      noDataMessage="사전 상담 요청이 없습니다."
      pagination={true}
      className="rounded-lg shadow-sm"
    />
  );
};

export default PreCounselTable;
