import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatPriceWithKorean } from "@utils/numberUtil";

interface PropertyTableProps {
  propertyList: Property[];
}

interface Property {
  uid: number;
  customerName: string;
  address: string;
  detailAddress: string;
  legalDistrictCode: string;
  deposit: number;
  monthlyRent: number;
  price: number;
  type: "SALE" | "DEPOSIT" | "MONTHLY";
  moveInDate: string;
  realCategory: string;
  petsAllowed: boolean;
  floor: number;
  hasElevator: boolean;
  constructionYear: string;
  parkingCapacity: number;
  netArea: number;
  totalArea: number;
  details: string;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "SALE":
      return {
        backgroundColor: "#E9F7EF",
        color: "#219653",
      };
    case "DEPOSIT":
      return {
        backgroundColor: "#FDEEEE",
        color: "#EB5757",
      };
    case "MONTHLY":
      return {
        backgroundColor: "#FEF5EB",
        color: "#F2994A",
      };
    default:
      return {
        backgroundColor: "#F5F5F5",
        color: "#757575",
      };
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "SALE":
      return "매매";
    case "DEPOSIT":
      return "전세";
    case "MONTHLY":
      return "월세";
    default:
      return "기타";
  }
};

function PropertyTable({ propertyList = [] }: PropertyTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 클라이언트 사이드 페이지네이션
  const paginatedProperties = propertyList.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleRowClick = (uid: number) => {
    navigate(`/properties/${uid}`);
  };

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>주소</TableCell>
              <TableCell>상세주소</TableCell>
              <TableCell>유형</TableCell>
              <TableCell>매매가</TableCell>
              <TableCell>보증금</TableCell>
              <TableCell>월세</TableCell>
              <TableCell>입주가능일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProperties.length > 0 ? (
              paginatedProperties.map((property) => (
                <TableRow
                  key={property.uid}
                  onClick={() => handleRowClick(property.uid)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.detailAddress}</TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeLabel(property.type)}
                      size="small"
                      sx={getTypeColor(property.type)}
                    />
                  </TableCell>
                  <TableCell>{formatPriceWithKorean(property.price)}</TableCell>
                  <TableCell>
                    {formatPriceWithKorean(property.deposit)}
                  </TableCell>
                  <TableCell>
                    {formatPriceWithKorean(property.monthlyRent)}
                  </TableCell>
                  <TableCell>
                    {new Date(property.moveInDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    등록된 매물이 없습니다
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          총 {propertyList.length}건
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>페이지당 행</InputLabel>
            <Select
              value={rowsPerPage}
              label="페이지당 행"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0); // 페이지당 행 수 변경시 첫 페이지로 이동
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={Math.ceil(propertyList.length / rowsPerPage)}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default PropertyTable;
