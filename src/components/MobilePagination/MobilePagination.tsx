import { Box, IconButton } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

interface MobilePaginationProps {
  page: number;
  totalElements: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
}

const MAX_VISIBLE_PAGES = 5;

const MobilePagination = ({
  page,
  totalElements,
  rowsPerPage,
  onPageChange,
}: MobilePaginationProps) => {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(_, newPage);
  };

  const totalPages = Math.ceil(totalElements / rowsPerPage);
  const currentPage = page;

  let startPage: number;
  let endPage: number;

  if (totalPages <= MAX_VISIBLE_PAGES) {
    startPage = 0;
    endPage = totalPages - 1;
  } else {
    const halfRange = Math.floor(MAX_VISIBLE_PAGES / 2);
    startPage = currentPage - halfRange;
    endPage = currentPage + halfRange;

    if (startPage < 0) {
      startPage = 0;
      endPage = MAX_VISIBLE_PAGES - 1;
    }

    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = totalPages - MAX_VISIBLE_PAGES;
    }

    startPage = Math.max(0, startPage);
    endPage = Math.min(totalPages - 1, endPage);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
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
      {pages.map((pageIndex) => (
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
      ))}

      {/* 다음 페이지 버튼 */}
      <IconButton
        size="small"
        onClick={() => handleChangePage(null, page + 1)}
        disabled={page >= totalPages - 1}
        className="w-8 h-8 border border-gray-300 rounded ml-2 disabled:opacity-50"
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default MobilePagination;
