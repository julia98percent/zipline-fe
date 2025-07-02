import { Typography } from "@mui/material";
import Table, { ColumnConfig } from "@components/Table/Table";
import dayjs from "dayjs";
import { Counsel } from "@ts/counsel";

interface Props {
  counsels: Counsel[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (counselUid: number) => void;
}

const CounselTable = ({
  counsels,
  isLoading,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
}: Props) => {
  // 컬럼 설정
  const columns: ColumnConfig<Counsel>[] = [
    {
      key: "title",
      label: "제목",
      render: (value) => value as string,
    },
    {
      key: "type",
      label: "상담 유형",
      render: (value) => value as string,
    },
    {
      key: "counselDate",
      label: "상담일",
      render: (value) => dayjs(value as string).format("YYYY-MM-DD"),
    },
    {
      key: "dueDate",
      label: "희망 의뢰 마감일",
      render: (value) =>
        value ? dayjs(value as string).format("YYYY-MM-DD") : "-",
    },
    {
      key: "completed",
      label: "의뢰 상태",
      render: (_, row) => {
        const counsel = row as Counsel;
        const isCompleted = !counsel.dueDate || counsel.completed;
        return (
          <Typography
            variant="body2"
            sx={{
              color: isCompleted ? "#219653" : "#F2994A",
              backgroundColor: isCompleted ? "#E9F7EF" : "#FEF5EB",
              py: 0.5,
              px: 1,
              borderRadius: 1,
              display: "inline-block",
            }}
          >
            {isCompleted ? "의뢰 마감" : "의뢰 진행중"}
          </Typography>
        );
      },
    },
  ];

  return (
    <Table
      isLoading={isLoading}
      columns={columns}
      bodyList={counsels.map((counsel) => ({
        ...counsel,
        id: counsel.counselUid,
      }))}
      handleRowClick={(rowData) => onRowClick(rowData.counselUid as number)}
      totalElements={totalElements}
      page={page}
      handleChangePage={onPageChange}
      rowsPerPage={rowsPerPage}
      handleChangeRowsPerPage={onRowsPerPageChange}
      noDataMessage="상담 내역이 없습니다."
      pagination={true}
      rowsPerPageOptions={[10, 25, 50]}
      sx={{
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    />
  );
};

export default CounselTable;
