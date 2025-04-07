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
  Typography,
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Chip from "@components/Chip";

const PROPERTY_TYPES = [
  { value: "SALE", name: "매매" },
  { value: "DEPOSIT", name: "전세" },
  { value: "MONTHLY", name: "월세" },
];

const DUMMY_CUSTOMER_DATA = {
  success: true,
  code: 200,
  message: "고객 목록 조회에 성공하였습니다.",
  data: {
    properties: [
      {
        address: "서울시 강남구 역삼동 123-45",
        dong: "역삼동",
        roadName: "테헤란로",
        extraAddress: "아파트 101호",
        deposit: 1000000,
        monthlyRent: 500000,
        price: 150000000,
        type: "SALE",
        longitude: 127.035,
        latitude: 37.501,
        startDate: "2025-04-07",
        endDate: "2025-04-30",
        moveInDate: "2025-05-01",
        realCategory: "ONE_ROOM",
        petsAllowed: true,
        floor: 3,
        hasElevator: true,
        constructionYear: {
          value: 2010,
          leap: false,
        },
        parkingCapacity: 1,
        netArea: 25.5,
        totalArea: 30.0,
        details: "현관 키패드 설치, 리모델링 완료",
      },
      {
        address: "서울시 종로구 사직동 67-8",
        dong: "사직동",
        roadName: "새문로",
        extraAddress: "빌라 203호",
        deposit: 500000,
        monthlyRent: 300000,
        price: 75000000,
        type: "MONTHLY",
        longitude: 126.976,
        latitude: 37.576,
        startDate: "2025-04-07",
        endDate: "2025-04-30",
        moveInDate: "2025-04-15",
        realCategory: "ONE_ROOM",
        petsAllowed: false,
        floor: 2,
        hasElevator: false,
        constructionYear: {
          value: 2005,
          leap: false,
        },
        parkingCapacity: 0,
        netArea: 20.0,
        totalArea: 25.0,
        details: "조용한 주거지, 주변 상권 발달",
      },
      {
        address: "서울시 마포구 서교동 88-12",
        dong: "서교동",
        roadName: "홍익로",
        extraAddress: "다세대주택 2층",
        deposit: 700000,
        monthlyRent: 400000,
        price: 90000000,
        type: "DEPOSIT",
        longitude: 126.922,
        latitude: 37.556,
        startDate: "2025-04-07",
        endDate: "2025-04-20",
        moveInDate: "2025-04-21",
        realCategory: "ONE_ROOM",
        petsAllowed: true,
        floor: 2,
        hasElevator: false,
        constructionYear: {
          value: 2015,
          leap: false,
        },
        parkingCapacity: 2,
        netArea: 22.0,
        totalArea: 27.0,
        details: "남향, 채광 좋음",
      },
      {
        address: "서울시 강남구 역삼동 123-45",
        dong: "역삼동",
        roadName: "테헤란로",
        extraAddress: "아파트 101호",
        deposit: 1000000,
        monthlyRent: 500000,
        price: 150000000,
        type: "SALE",
        longitude: 127.035,
        latitude: 37.501,
        startDate: "2025-04-07",
        endDate: "2025-04-30",
        moveInDate: "2025-05-01",
        realCategory: "ONE_ROOM",
        petsAllowed: true,
        floor: 3,
        hasElevator: true,
        constructionYear: {
          value: 2010,
          leap: false,
        },
        parkingCapacity: 1,
        netArea: 25.5,
        totalArea: 30.0,
        details: "현관 키패드 설치, 리모델링 완료",
      },
    ],
  },
};

const PropertyTable = () => {
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
  const [rowsPerPage, setRowsPerPage] = useState(2);

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

  const properties = DUMMY_CUSTOMER_DATA.data.properties;

  const displayedCustomers = properties.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        내 매물 목록
      </Typography>
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
          <Table sx={{ minWidth: 650 }} aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">보증금</TableCell>
                <TableCell align="center">월세</TableCell>
                <TableCell align="center">매물 유형</TableCell>
                <TableCell align="center">
                  면적(순/총) {useMetric ? "(m²)" : "(평)"}
                </TableCell>
                <TableCell align="center">반려동물</TableCell>
                <TableCell align="center">엘리베이터</TableCell>
                <TableCell align="center">층</TableCell>
                <TableCell align="center">건축 연도</TableCell>
                <TableCell align="center">세대별 주차 가능 수</TableCell>
                <TableCell align="center">기타 상세</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCustomers.map((property, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{property.address}</TableCell>
                  <TableCell align="center">
                    {property.deposit.toLocaleString()} 원
                  </TableCell>
                  <TableCell align="center">
                    {property.monthlyRent.toLocaleString()} 원
                  </TableCell>
                  <TableCell align="center">
                    {getPropertyTypeName(property.type)}
                  </TableCell>
                  <TableCell align="center">
                    {formatArea(property.netArea, property.totalArea)}
                  </TableCell>
                  <TableCell align="center">
                    {property.petsAllowed ? (
                      <Chip color="success" text="가능" />
                    ) : (
                      <Chip color="error" text="불가능" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {property.hasElevator ? (
                      <Chip color="primary" text="O" />
                    ) : (
                      <Chip color="default" text="X" />
                    )}
                  </TableCell>
                  <TableCell align="center">{property.floor}</TableCell>
                  <TableCell align="center">
                    {property.constructionYear.value ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {property.parkingCapacity}
                  </TableCell>
                  <TableCell align="center">{property.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={properties.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[2, 5, 10]}
          labelRowsPerPage="페이지당 행"
        />
      </Paper>
    </Box>
  );
};

export default PropertyTable;
