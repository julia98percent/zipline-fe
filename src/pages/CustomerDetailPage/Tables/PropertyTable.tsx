import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatPriceWithKorean } from "@utils/numberUtil";

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

interface PropertyTableProps {
  properties: Property[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading: boolean;
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

function PropertyTable({
  properties,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading,
}: PropertyTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (uid: number) => {
    navigate(`/properties/${uid}`);
  };

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "28%" }}>주소</TableCell>
              <TableCell sx={{ width: "5%" }}>유형</TableCell>
              <TableCell sx={{ width: "20%" }}>매매가</TableCell>
              <TableCell sx={{ width: "17%" }}>보증금</TableCell>
              <TableCell sx={{ width: "17%" }}>월세</TableCell>
              <TableCell sx={{ width: "12%" }}>입주가능일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : properties.length > 0 ? (
              properties.map((property) => (
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
                  <TableCell>
                    {`${property.address ?? ""}${
                      property.detailAddress ? " " + property.detailAddress : ""
                    }`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeLabel(property.type)}
                      size="small"
                      sx={getTypeColor(property.type)}
                    />
                  </TableCell>
                  <TableCell sx={{ width: "90px" }}>
                    {property.price
                      ? formatPriceWithKorean(property.price)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {property.deposit
                      ? formatPriceWithKorean(property.deposit)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {property.monthlyRent
                      ? formatPriceWithKorean(property.monthlyRent)
                      : "-"}
                  </TableCell>
                  <TableCell sx={{ width: "140px" }}>
                    {new Date(property.moveInDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <div style={{ color: "#757575", fontSize: "1rem" }}>
                    등록된 매물이 없습니다
                  </div>
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
        }}
      >
        <Typography variant="body2" color="text.secondary">
          총 {totalCount}건
        </Typography>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}건 중 ${from}-${to}건`
          }
        />
      </Box>
    </Paper>
  );
}

export default PropertyTable;
