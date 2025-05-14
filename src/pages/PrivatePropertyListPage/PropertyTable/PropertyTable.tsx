import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { PropertyItem } from "../PrivatePropertyListPage";

interface Props {
  propertyList: PropertyItem[];
  onRowClick?: (property: PropertyItem) => void;
  totalElements: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const categoryColors: Record<
  PropertyItem["realCategory"],
  "primary" | "secondary" | "default" | "success" | "error" | "warning" | "info"
> = {
  ONE_ROOM: "primary",
  TWO_ROOM: "primary",
  APARTMENT: "success",
  VILLA: "info",
  HOUSE: "warning",
  OFFICETEL: "secondary",
  COMMERCIAL: "error",
};

// 연한 파스텔톤 색상 매핑
const colorMap: Record<string, string> = {
  SALE: "#e8f5e9",    // 연한 초록
  DEPOSIT: "#e3f2fd", // 연한 파랑
  MONTHLY: "#fff3e0", // 연한 주황
};
const textColorMap: Record<string, string> = {
  SALE: "#388e3c",    // 진한 초록
  DEPOSIT: "#1976d2", // 진한 파랑
  MONTHLY: "#f57c00", // 진한 주황
};
const translateType = (type: string) => {
  switch (type) {
    case "SALE":
      return "매매";
    case "DEPOSIT":
      return "전세";
    case "MONTHLY":
      return "월세";
    default:
      return "-";
  }
};

const PropertyTable = ({
  propertyList,
  onRowClick,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  const [useMetric, setUseMetric] = useState(true);

  const handleToggleUnitChange = () => {
    setUseMetric(!useMetric);
  };

  const convertToKoreanPyeong = (squareMeters: number) => {
    return (squareMeters / 3.3).toFixed(1);
  };

  const formatArea = (netArea: number) => {
    if (!netArea) return "-";
    return useMetric ? `${netArea}㎡` : `${convertToKoreanPyeong(netArea)}평`;
  };

  return (
    <Box sx={{ width: "100%", mt: "28px" }}>
      <FormControlLabel
        control={
          <Switch
            checked={useMetric}
            onChange={handleToggleUnitChange}
            color="primary"
            size="small"
          />
        }
        label={useMetric ? "제곱미터(m²)" : "평(py)"}
        sx={{
          mb: "5px",
          ml: "0px",
          '& .MuiFormControlLabel-label': {
            fontSize: '14px',
          }
        }}
      />
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "none",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">매물 유형</TableCell>
                <TableCell align="center">매물 타입</TableCell>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">면적(전용)</TableCell>
                <TableCell align="center">기타</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propertyList.length > 0 ? (
                propertyList.map((property) => (
                  <TableRow
                    key={property.uid}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => onRowClick?.(property)}
                  >
                    <TableCell align="center">
                      <Chip
                        label={translateRealCategory(property.realCategory)}
                        color={
                          categoryColors[property.realCategory] || "default"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={translateType(property.type)}
                        sx={{
                          backgroundColor: colorMap[property.type] || "#e0e0e0",
                          color: textColorMap[property.type] || "#222",
                          fontWeight: 500,
                          fontSize: "0.95em",
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {`${property.address ?? ""}${
                        property.detailAddress
                          ? ` ${property.detailAddress}`
                          : ""
                      }`.trim() || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {formatArea(property.netArea)}
                    </TableCell>
                    <TableCell align="center">
                      {property.details
                        ? property.details.length > 20
                          ? property.details.slice(0, 20) + "..."
                          : property.details
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ padding: "20px 0" }}
                  >
                    매물 데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}개 중 ${from}-${to}개`
          }
        />
      </Paper>
    </Box>
  );
};

const translateRealCategory = (category: PropertyItem["realCategory"]) => {
  switch (category) {
    case "ONE_ROOM":
      return "원룸";
    case "TWO_ROOM":
      return "투룸";
    case "APARTMENT":
      return "아파트";
    case "VILLA":
      return "빌라";
    case "HOUSE":
      return "주택";
    case "OFFICETEL":
      return "오피스텔";
    case "COMMERCIAL":
      return "상가";
    default:
      return "-";
  }
};

export default PropertyTable;
