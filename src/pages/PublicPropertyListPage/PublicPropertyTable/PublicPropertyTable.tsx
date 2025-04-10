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
  Switch,
  FormControlLabel,
} from "@mui/material";

interface PropertyItem {
  id: number;
  articleId: string;
  regionCode: string;
  category: string;
  buildingName: string;
  description: string;
  buildingType: string;
  price: number;
  deposit: number;
  monthlyRent: number;
  longitude: number;
  latitude: number;
  supplyArea: number;
  exclusiveArea: number;
  platform: string;
  platformUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  propertyList: PropertyItem[];
}

const PublicPropertyTable = ({ propertyList }: Props) => {
  const [useMetric, setUseMetric] = useState(true);

  const formatArea = (supplyArea: number, exclusiveArea: number) => {
    return useMetric
      ? `${exclusiveArea}m² / ${supplyArea}m²`
      : `${(exclusiveArea / 3.3).toFixed(1)}평 / ${(supplyArea / 3.3).toFixed(
          1
        )}평`;
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
                <TableCell align="center">매물 ID</TableCell>
                <TableCell align="center">매물 유형</TableCell>
                <TableCell align="center">건물명</TableCell>
                <TableCell align="center">설명</TableCell>
                <TableCell align="center">매매 가격</TableCell>
                <TableCell align="center">보증금</TableCell>
                <TableCell align="center">월세</TableCell>
                <TableCell align="center">
                  면적(순/총) {useMetric ? "(m²)" : "(평)"}
                </TableCell>
                <TableCell align="center">플랫폼</TableCell>
                <TableCell align="center">등록일</TableCell>
                <TableCell align="center">수정일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProperties.length > 0 ? (
                displayedProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell align="center">{property.id}</TableCell>
                    <TableCell align="center">{property.category}</TableCell>
                    <TableCell align="center">
                      {property.buildingName ?? "-"}
                    </TableCell>
                    <TableCell align="center">
                      {property.description ?? "-"}
                    </TableCell>
                    <TableCell align="center">
                      {property.price.toLocaleString()} 원
                    </TableCell>
                    <TableCell align="center">
                      {property.deposit.toLocaleString()} 원
                    </TableCell>
                    <TableCell align="center">
                      {property.monthlyRent.toLocaleString()} 원
                    </TableCell>
                    <TableCell align="center">
                      {formatArea(property.supplyArea, property.exclusiveArea)}
                    </TableCell>
                    <TableCell align="center">{property.platform}</TableCell>
                    <TableCell align="center">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{
                      padding: "20px 0",
                    }}
                  >
                    데이터가 없습니다
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

export default PublicPropertyTable;
