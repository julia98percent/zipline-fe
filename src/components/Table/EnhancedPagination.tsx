import {
  Box,
  IconButton,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

interface Props {
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (_: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  hidePaginationControls?: boolean;
}

const EnhancedPagination = ({
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
  hidePaginationControls = false,
}: Props) => {
  const [pageInput, setPageInput] = useState<string>("");
  const totalPages = Math.ceil(totalElements / rowsPerPage);

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(null, pageNumber - 1); // 0-based index
      setPageInput("");
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(null, page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(null, page + 1);
    }
  };

  // 페이지 번호 버튼들을 생성하는 함수
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const currentPage = page + 1; // 1-based

    // 현재 페이지 주변의 페이지들을 보여줄 범위 계산
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // 범위 조정 (최소 5개 페이지 표시하려고 시도)
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Box className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white min-h-[56px]">
      <Box
        className={`flex items-center gap-6 ${
          hidePaginationControls ? "hidden md:flex" : "flex"
        }`}
      >
        <Typography
          variant="body2"
          className="text-gray-600 text-sm whitespace-nowrap"
        >
          페이지당 행 수
        </Typography>
        <TablePagination
          className="[&_.MuiTablePagination-toolbar]:min-h-0
          [&_.MuiTablePagination-toolbar]:px-0
          [&_.MuiTablePagination-select:not(.MuiSelect-select)]:border
          [&_.MuiTablePagination-select]:border-gray-300
          [&_.MuiTablePagination-select]:rounded
          [&_.MuiTablePagination-select]:pl-2 [&_.MuiTablePagination-select]:pr-5
          [&_.MuiTablePagination-select]:w-[60px] [&_.MuiTablePagination-select]:flex
          [&_.MuiTablePagination-select]:items-center [&_.MuiTablePagination-select]:bg-white
          [&_.MuiTablePagination-select]:text-sm"
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={() => {}}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage=""
          labelDisplayedRows={() => ""}
          ActionsComponent={() => null}
        />
        <Typography
          variant="body2"
          className="text-gray-600 text-sm whitespace-nowrap"
        ></Typography>
      </Box>

      {/* 오른쪽: 페이지네이션 컨트롤과 페이지 이동 */}
      <Box className="flex items-center gap-8">
        {/* 페이지네이션 컨트롤 */}
        <Box className="flex items-center gap-2">
          {/* 이전 페이지 */}
          <IconButton
            size="small"
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="w-8 h-8 border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-100 hover:border-blue-500 disabled:bg-white disabled:border-gray-300 disabled:text-gray-400 disabled:opacity-60"
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          {/* 페이지 번호들 */}
          {pageNumbers.map((pageNum) => (
            <IconButton
              key={pageNum}
              size="small"
              onClick={() => onPageChange(null, pageNum - 1)}
              className={`w-8 h-8 border rounded text-sm font-normal ${
                pageNum === page + 1
                  ? "border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600 hover:border-blue-600"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-blue-500"
              }`}
            >
              {pageNum}
            </IconButton>
          ))}

          {/* 페이지가 많을 때 ... 표시 */}
          {page + 3 < totalPages && (
            <Typography
              variant="body2"
              className="mx-4 text-gray-600 flex items-center h-8"
            >
              ...
            </Typography>
          )}

          {/* 다음 페이지 */}
          <IconButton
            size="small"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="w-8 h-8 border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-100 hover:border-blue-500 disabled:bg-white disabled:border-gray-300 disabled:text-gray-400 disabled:opacity-60"
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 페이지 직접 이동 */}
        <Box
          className={`flex items-center gap-4 ${
            hidePaginationControls ? "hidden md:flex" : "flex"
          }`}
        >
          <TextField
            size="small"
            type="number"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
            placeholder={`1-${totalPages}`}
            className="w-[70px] [&_.MuiOutlinedInput-root]:h-8 [&_.MuiOutlinedInput-root]:rounded [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-blue-500 [&_input]:px-2 [&_input]:py-0 [&_input]:text-sm [&_input]:text-center [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:[appearance:textfield]"
          />
          <Typography
            variant="body2"
            className="text-gray-600 text-sm whitespace-nowrap"
          >
            페이지로 이동
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EnhancedPagination;
