import {
  Box,
  IconButton,
  TablePagination,
  TextField,
  Typography,
  Tooltip,
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
}

const EnhancedPagination = ({
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* 왼쪽: 페이지당 행 수와 행 정보 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            페이지당 행 수
          </Typography>
          <TablePagination
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
            sx={{
              "& .MuiTablePagination-toolbar": {
                minHeight: "auto",
                paddingLeft: 0,
                paddingRight: 0,
              },
              "& .MuiTablePagination-selectLabel": {
                display: "none",
              },
              "& .MuiTablePagination-displayedRows": {
                display: "none",
              },
              "& .MuiTablePagination-select": {
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                paddingLeft: 1,
                paddingRight: 3,
                minHeight: "30px",
                display: "flex",
                alignItems: "center",
                "&:focus": {
                  borderColor: "primary.main",
                  borderRadius: 1,
                },
              },
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {totalElements > 0
            ? `${page * rowsPerPage + 1}-${Math.min(
                (page + 1) * rowsPerPage,
                totalElements
              )}개 중 ${totalElements}개`
            : "0개 중 0-0개"}
        </Typography>
      </Box>

      {/* 오른쪽: 페이지네이션 컨트롤과 페이지 이동 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* 페이지네이션 컨트롤 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* 이전 페이지 */}
          <Tooltip title="이전 페이지">
            <span>
              <IconButton
                size="small"
                onClick={handlePreviousPage}
                disabled={page === 0}
                sx={{
                  width: 32,
                  height: 32,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {/* 페이지 번호들 */}
          {pageNumbers.map((pageNum) => (
            <IconButton
              key={pageNum}
              size="small"
              onClick={() => onPageChange(null, pageNum - 1)}
              sx={{
                width: 32,
                height: 32,
                border: "1px solid",
                borderColor: pageNum === page + 1 ? "primary.main" : "divider",
                borderRadius: 1,
                backgroundColor:
                  pageNum === page + 1 ? "primary.main" : "transparent",
                color:
                  pageNum === page + 1
                    ? "primary.contrastText"
                    : "text.primary",
                fontSize: "14px",
                fontWeight: pageNum === page + 1 ? "bold" : "normal",
                "&:hover": {
                  backgroundColor:
                    pageNum === page + 1 ? "primary.dark" : "action.hover",
                },
              }}
            >
              {pageNum}
            </IconButton>
          ))}

          {/* 페이지가 많을 때 ... 표시 */}
          {page + 3 < totalPages && (
            <Typography
              variant="body2"
              sx={{
                mx: 1,
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                height: 32,
              }}
            >
              ...
            </Typography>
          )}

          {/* 다음 페이지 */}
          <Tooltip title="다음 페이지">
            <span>
              <IconButton
                size="small"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
                sx={{
                  width: 32,
                  height: 32,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* 페이지 직접 이동 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            sx={{
              width: "80px",
              "& .MuiOutlinedInput-root": {
                height: "32px",
              },
              "& input": {
                padding: "0px 8px",
                "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                MozAppearance: "textfield",
              },
            }}
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            페이지로 이동
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EnhancedPagination;
