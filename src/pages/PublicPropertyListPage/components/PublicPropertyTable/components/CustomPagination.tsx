import {
  Box,
  IconButton,
  InputAdornment,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ROWS_PER_PAGE_OPTIONS } from "@components/Table/Table";

interface Props {
  pageInput: string;
  totalPages: number;
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageInputSubmit: () => void;
  onPageChange: (_: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomPagination = ({
  pageInput,
  totalPages,
  totalElements,
  page,
  rowsPerPage,
  onPageInputChange,
  onPageInputSubmit,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          size="small"
          type="text"
          value={pageInput}
          onChange={onPageInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onPageInputSubmit();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onPageInputSubmit}>
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              height: "28px",
              "& input": {
                padding: "0px 8px",
                "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                MozAppearance: "textfield",
              },
            },
          }}
          sx={{
            width: "110px",
            "& .MuiOutlinedInput-root": {
              height: "28px",
            },
          }}
        />
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          / {totalPages} 페이지
        </Typography>
      </Box>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        labelRowsPerPage="페이지당 행 수"
        labelDisplayedRows={({ from, to, count }) =>
          `${count}개 중 ${from}-${to}개`
        }
      />
    </Box>
  );
};

export default CustomPagination;
