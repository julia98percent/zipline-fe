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
} from "@mui/material";
import Chip from "@components/Chip";
import { PropertyItem } from "../PrivatePropertyListPage";

interface Props {
  propertyList: PropertyItem[];
}

const PROPERTY_TYPES = [
  { value: "SALE", name: "매매" },
  { value: "DEPOSIT", name: "전세" },
  { value: "MONTHLY", name: "월세" },
];

const PropertyTable = ({ propertyList }: Props) => {
  const [useMetric, setUseMetric] = useState(true);

  const convertToKoreanPyeong = (squareMeters: number) => {
    return (squareMeters / 3.3).toFixed(1);
  };

  const formatArea = (netArea: number, totalArea: number) => {
    if (useMetric) {
      return `${netArea}m² / ${totalArea}m²`;
    } else {
      return `${convertToKoreanPyeong(netArea)}평 / ${convertToKoreanPyeong(
        totalArea
      )}평`;
    }
  };

  const getPropertyTypeName = (typeValue: string) => {
    const type = PROPERTY_TYPES.find((item) => item.value === typeValue);
    return type ? type.name : typeValue;
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleToggleUnitChange = () => {
    setUseMetric(!useMetric);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedProperties = propertyList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                <TableCell align="center">매매 가격</TableCell>
                <TableCell align="center">보증금</TableCell>
                <TableCell align="center">월세</TableCell>
                <TableCell align="center">
                  면적(순/총) {useMetric ? "(m²)" : "(평)"}
                </TableCell>
                <TableCell align="center">반려동물</TableCell>
                <TableCell align="center">엘리베이터</TableCell>
                <TableCell align="center">층</TableCell>
                <TableCell align="center">건축 연도</TableCell>
                <TableCell align="center">세대별 주차 가능 수</TableCell>
                <TableCell align="center">기타</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProperties.length > 0 ? (
                displayedProperties.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {getPropertyTypeName(property.type)}
                    </TableCell>

                    <TableCell align="center">
                      {property.address ?? "-"}
                    </TableCell>

                    <TableCell align="center">
                      {property.price?.toLocaleString() ?? "-"} 원
                    </TableCell>

                    <TableCell align="center">
                      {property.deposit?.toLocaleString() ?? "-"} 원
                    </TableCell>

                    <TableCell align="center">
                      {property.monthlyRent?.toLocaleString() ?? "-"} 원
                    </TableCell>

                    <TableCell align="center">
                      {property.netArea && property.totalArea
                        ? formatArea(property.netArea, property.totalArea)
                        : "정보 없음"}
                    </TableCell>

                    <TableCell align="center">
                      {property.petsAllowed !== undefined ? (
                        property.petsAllowed ? (
                          <Chip color="success" text="가능" />
                        ) : (
                          <Chip color="error" text="불가능" />
                        )
                      ) : (
                        "정보 없음"
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {property.hasElevator !== undefined ? (
                        property.hasElevator ? (
                          <Chip color="primary" text="O" />
                        ) : (
                          <Chip color="default" text="X" />
                        )
                      ) : (
                        "정보 없음"
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {property.floor ?? "-"}
                    </TableCell>

                    <TableCell align="center">
                      {property.constructionYear ?? "-"}
                    </TableCell>

                    <TableCell align="center">
                      {property.parkingCapacity ?? "-"}
                    </TableCell>

                    <TableCell align="center">
                      {property.details ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow sx={{ width: "100%" }}>
                  <TableCell
                    colSpan={12}
                    align="center"
                    sx={{
                      width: "100%",
                      padding: "20px 0",
                    }}
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
          count={propertyList.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage="페이지당 행"
        />
      </Paper>
    </Box>
  );
};

export default PropertyTable;
