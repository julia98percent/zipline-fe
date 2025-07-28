import { Typography, Box, IconButton } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import Table, { ColumnConfig } from "@components/Table/Table";
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
      <Box className="hidden md:block">
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
      <Box className="block md:hidden">
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
            {/* 모바일용 간단한 페이지네이션 */}
            <Box className="flex justify-center items-center mt-6 gap-1">
              {/* 이전 페이지 버튼 */}
              <IconButton
                size="small"
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                className="w-8 h-8 border border-gray-300 rounded mr-2 disabled:opacity-50"
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>

              {/* 페이지 번호들 */}
              {(() => {
                const totalPages = Math.ceil(totalElements / rowsPerPage);
                const currentPage = page;
                const startPage = Math.max(0, currentPage - 1);
                const endPage = Math.min(totalPages - 1, currentPage + 1);
                const pages = [];

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return pages.map((pageIndex) => (
                  <Box
                    key={pageIndex}
                    onClick={() => handleChangePage(null, pageIndex)}
                    className={`w-8 h-8 flex items-center justify-center border rounded cursor-pointer text-sm ${
                      page === pageIndex
                        ? "border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600"
                        : "border-gray-300 bg-transparent text-gray-900 font-normal hover:bg-gray-100"
                    }`}
                  >
                    {pageIndex + 1}
                  </Box>
                ));
              })()}

              {/* 다음 페이지 버튼 */}
              <IconButton
                size="small"
                onClick={() => handleChangePage(null, page + 1)}
                disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
                className="w-8 h-8 border border-gray-300 rounded ml-2 disabled:opacity-50"
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CounselTable;
