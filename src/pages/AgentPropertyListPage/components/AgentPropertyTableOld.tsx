import { useState, useEffect } from "react";
import {
  TablePagination,
  Button,
  Box,
  Typography,
  TextField,
  Chip,
} from "@mui/material";
import Table, { ColumnConfig } from "@components/Table/Table";
import { Property, PropertyCategory } from "@ts/property";
import { formatDate } from "@utils/dateUtil";

interface AgentPropertyTableProps {
  propertyList: Property[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  useMetric: boolean;
  onRowClick?: (property: Property) => void;
}

const AgentPropertyTable = ({
  propertyList,
  totalElements,
  totalPages,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  useMetric,
  onRowClick,
}: AgentPropertyTableProps) => {
  const [pageInput, setPageInput] = useState<string>("");

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = () => {
    const newPage = parseInt(pageInput) - 1;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  useEffect(() => {
    setPageInput((page + 1).toString());
  }, [page]);

  const formatArea = (area: number) => {
    if (useMetric) {
      return `${area.toFixed(1)}m²`;
    } else {
      return `${(area / 3.3058).toFixed(1)}평`;
    }
  };

  const getPropertyTypeText = (type: string) => {
    switch (type) {
      case "SALE":
        return "매매";
      case "DEPOSIT":
        return "전세";
      case "MONTHLY":
        return "월세";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  const getPriceText = (property: Property) => {
    if (property.type === "SALE") {
      return property.price ? formatCurrency(property.price) : "-";
    } else if (property.type === "DEPOSIT") {
      return property.deposit ? formatCurrency(property.deposit) : "-";
    } else {
      const deposit = property.deposit ? formatCurrency(property.deposit) : "0";
      const monthly = property.monthlyRent
        ? formatCurrency(property.monthlyRent)
        : "0";
      return `${deposit}/${monthly}`;
    }
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: "bold" }}>고객명</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>주소</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>종류</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>거래유형</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>가격</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>전용면적</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>입주가능일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {propertyList.map((property) => (
              <TableRow
                key={property.uid}
                hover
                onClick={() => onRowClick?.(property)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  "&:hover": {
                    backgroundColor: onRowClick ? "action.hover" : "inherit",
                  },
                }}
              >
                <TableCell>{property.customerName}</TableCell>
                <TableCell>
                  <Typography variant="body2">{property.address}</Typography>
                  {property.detailAddress && (
                    <Typography variant="caption" color="text.secondary">
                      {property.detailAddress}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={PropertyCategory[property.realCategory]}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPropertyTypeText(property.type)}
                    size="small"
                    color={
                      property.type === "SALE"
                        ? "error"
                        : property.type === "DEPOSIT"
                        ? "warning"
                        : "success"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {getPriceText(property)}
                  </Typography>
                </TableCell>
                <TableCell>{formatArea(property.netArea)}</TableCell>
                <TableCell>
                  {property.moveInDate ? formatDate(property.moveInDate) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">페이지 이동:</Typography>
          <TextField
            size="small"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
            sx={{ width: "80px" }}
          />
          <Typography variant="body2">/ {totalPages}</Typography>
          <Button size="small" onClick={handlePageInputSubmit}>
            이동
          </Button>
        </Box>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </Box>
    </Box>
  );
};

export default AgentPropertyTable;
