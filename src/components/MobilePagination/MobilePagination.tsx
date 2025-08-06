import { IconButton } from "@mui/material";
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
    <div className="flex justify-center items-center mt-6 gap-1">
      <IconButton
        size="small"
        onClick={() => handleChangePage(null, page - 1)}
        disabled={page === 0}
        className="bg-white w-8 h-8 border border-gray-300 rounded disabled:opacity-50"
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      {pages.map((pageIndex) => (
        <IconButton
          key={pageIndex}
          onClick={() => handleChangePage(null, pageIndex)}
          disabled={pageIndex === page}
          className={`w-8 h-8 border rounded text-sm font-normal ${
            pageIndex === page
              ? "border-primary bg-primary text-white font-bold hover:bg-primary-dark hover:border-primary-dark"
              : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-primary"
          }`}
        >
          {pageIndex + 1}
        </IconButton>
      ))}

      <IconButton
        size="small"
        onClick={() => handleChangePage(null, page + 1)}
        disabled={page >= totalPages - 1}
        className="bg-white w-8 h-8 border border-gray-300 rounded disabled:opacity-50"
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default MobilePagination;
