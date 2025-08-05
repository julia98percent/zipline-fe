import { Typography, Box } from "@mui/material";
import Table, { ColumnConfig } from "@components/Table/Table";
import MobilePagination from "@components/MobilePagination";
import dayjs from "dayjs";
import { Counsel } from "@ts/counsel";
import CounselCard from "./CounselCard";

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
        value ? dayjs(value as string).format("YYYY-MM-DD") : "없음",
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
            className="py-2 px-2 rounded-sm inline-block"
            sx={{
              color: isCompleted ? "#219653" : "#F2994A",
              backgroundColor: isCompleted ? "#E9F7EF" : "#FEF5EB",
            }}
          >
            {isCompleted ? "의뢰 마감" : "의뢰 진행 중"}
          </Typography>
        );
      },
    },
  ];

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(_, newPage);
  };

  return (
    <Box className="w-full">
      {/* Desktop view - 768px and above */}
      <Box className="hidden lg:block">
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
          className="rounded-sm shadow-md"
        />
      </Box>

      {/* Mobile view - below 768px */}
      <Box className="block lg:hidden">
        {counsels.length === 0 ? (
          <Box className="text-center py-8 text-gray-500">
            상담 내역이 없습니다.
          </Box>
        ) : (
          <>
            <Box className="space-y-4">
              {counsels.map((counsel) => (
                <CounselCard
                  key={counsel.counselUid}
                  counsel={counsel}
                  onRowClick={onRowClick}
                />
              ))}
            </Box>
            <MobilePagination
              page={page}
              totalElements={totalElements}
              rowsPerPage={rowsPerPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default CounselTable;
