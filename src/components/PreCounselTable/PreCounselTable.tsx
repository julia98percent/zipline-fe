import { Box, IconButton } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import Table, { ColumnConfig } from "@components/Table/Table";
import dayjs from "dayjs";
import { PreCounsel } from "@ts/counsel";
import PreCounselCard from "./PreCounselCard";

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
      </Box>

      {/* Mobile view - below 768px */}
      <Box className="block md:hidden">
        {counsels.length === 0 ? (
          <Box className="text-center py-8 text-gray-500">
            사전 상담 요청이 없습니다.
          </Box>
        ) : (
          <>
            <Box className="space-y-4">
              {counsels.map((counsel) => (
                <PreCounselCard
                  key={counsel.surveyResponseUid}
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

export default PreCounselTable;
