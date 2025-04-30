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
import { useNavigate } from "react-router-dom";

interface Props {
  propertyList: PropertyItem[];
}

const categoryColors: Record<PropertyItem["realCategory"], "primary" | "secondary" | "default" | "success" | "error" | "warning" | "info"> = {
  ONE_ROOM: "primary",
  TWO_ROOM: "primary",
  APARTMENT: "success",
  VILLA: "info",
  HOUSE: "warning",
  OFFICETEL: "secondary",
  COMMERCIAL: "error",
};

const PropertyTable = ({ propertyList }: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [useMetric, setUseMetric] = useState(true);
  const navigate = useNavigate(); 

  const handleToggleUnitChange = () => {
    setUseMetric(!useMetric);
  };

  const displayedProperties = propertyList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const convertToKoreanPyeong = (squareMeters: number) => {
    return (squareMeters / 3.3).toFixed(1);
  };

  const formatArea = (netArea: number) => {
    if (!netArea) return "-";
    return useMetric ? `${netArea}㎡` : `${convertToKoreanPyeong(netArea)}평`;
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <FormControlLabel
        control={
          <Switch
            checked={useMetric}
            onChange={handleToggleUnitChange}
            color="primary"
          />
        }
        label={useMetric ? "제곱미터(m²)" : "평(py)"}
      />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">매물 유형</TableCell>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">면적(전용)</TableCell>
                <TableCell align="center">기타</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProperties.length > 0 ? (
                displayedProperties.map((property) => (
                  <TableRow
                    key={property.uid}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/properties/${property.uid}`)} 
                  >
                    <TableCell align="center">
                      <Chip
                        label={translateRealCategory(property.realCategory)}
                        color={categoryColors[property.realCategory] || "default"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{property.address ?? "-"}</TableCell>
                    <TableCell align="center">{formatArea(property.netArea)}</TableCell>
                    <TableCell align="center">{property.details ?? "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ padding: "20px 0" }}>
                    매물 데이터가 없습니다
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={propertyList.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="페이지당 행"
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
