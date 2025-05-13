import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { PublicPropertyItem } from "../PublicPropertyListPage";

interface Props {
  propertyList: PublicPropertyItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  category?: string;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onSort: (field: string) => void;
  sortFields: { [key: string]: string };
  useMetric: boolean;
  useRoadAddress: boolean;
}

const CATEGORY_LABELS: { [key: string]: string } = {
  SALE: "매매",
  MONTHLY: "월세",
  DEPOSIT: "전세"
};

const PublicPropertyTable = ({
  propertyList,
  totalElements,
  totalPages,
  page,
  rowsPerPage,
  category,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortFields,
  useMetric,
  useRoadAddress,
}: Props) => {
  const [pageInput, setPageInput] = useState<string>('');

  const formatPrice = (value: number) => {
    if (value === 0) return "-";
    return value >= 10000
      ? `${Math.floor(value / 10000)}억 ${value % 10000 > 0 ? `${value % 10000}만` : ''}`
      : `${value}만`;
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const getSortDirection = (field: string) => {
    return sortFields[field] || false;
  };

  const getSortIcon = (field: string) => {
    const direction = getSortDirection(field);
    if (!direction) return null;
    return direction === "ASC" ? "↑" : "↓";
  };

  const formatBuildingInfo = (property: PublicPropertyItem) => {
    if (!property.buildingName && !property.buildingType) return "-";

    const buildingType = property.buildingType ? `[${property.buildingType}]` : '';
    const buildingName = property.buildingName || '';

    return `${buildingType} ${buildingName}`.trim();
  };

  const SortableHeader = ({
    field,
    label,
    unit = ''
  }: {
    field: string;
    label: string;
    unit?: string;
  }) => (
    <TableSortLabel
      active={!!getSortDirection(field)}
      direction={getSortDirection(field) === "ASC" ? "asc" : "desc"}
      onClick={() => onSort(field)}
      sx={{
        '&.MuiTableSortLabel-root': {
          color: 'text.primary',
          '&:hover': {
            color: 'primary.main',
          },
        },
        '&.Mui-active': {
          color: 'primary.main',
          fontWeight: 'bold',
        },
        '& .MuiTableSortLabel-icon': {
          opacity: 0.5,
          '&:hover': {
            opacity: 1,
          },
        },
      }}
    >
      {label} {unit} {getSortIcon(field)}
    </TableSortLabel>
  );

  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = () => {
    const newPage = parseInt(pageInput) - 1;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  // Update input value when page changes
  useEffect(() => {
    setPageInput((page + 1).toString());
  }, [page]);

  const isPriceSorted = !!sortFields.price;
  const isDepositSorted = !!sortFields.deposit;
  const isMonthlyRentSorted = !!sortFields.monthlyRent;

  // Determine column visibility based on sort first, then category
  let showPriceHeader = false;
  let showDepositHeader = false;
  let showMonthlyRentHeader = false;

  if (isPriceSorted) {
    showPriceHeader = true;
    showDepositHeader = false; // Hide others when sorting price
    showMonthlyRentHeader = false;
  } else if (isDepositSorted) {
    showPriceHeader = false; // Hide others when sorting deposit
    showDepositHeader = true;
    showMonthlyRentHeader = false;
  } else if (isMonthlyRentSorted) {
    showPriceHeader = false;
    showDepositHeader = true; // Show deposit when sorting monthly
    showMonthlyRentHeader = true;
  } else {
    // Default visibility based on category filter (if no price sort active)
    showPriceHeader = !category || category === "SALE";
    showDepositHeader = !category || category === "MONTHLY" || category === "DEPOSIT";
    showMonthlyRentHeader = !category || category === "MONTHLY";
  }

  // Calculate colspan based on visible headers
  let colSpanCount = 5; // Base columns (ID, Type, Building, Address, Desc)
  if (showPriceHeader) colSpanCount++;
  if (showDepositHeader) colSpanCount++;
  if (showMonthlyRentHeader) colSpanCount++;
  colSpanCount += 2; // Area columns

  return (
    <Box sx={{ width: "100%", mt: "0px" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">플랫폼</TableCell>
            <TableCell align="center">매물 유형</TableCell>
            <TableCell align="center">건물 정보</TableCell>
            <TableCell align="center">주소</TableCell>
            <TableCell align="center">설명</TableCell>
            {showPriceHeader && (
              <TableCell align="center">
                <SortableHeader field="price" label="매매 가격" />
              </TableCell>
            )}
            {showDepositHeader && (
              <TableCell align="center">
                <SortableHeader field="deposit" label="보증금" />
              </TableCell>
            )}
            {showMonthlyRentHeader && (
              <TableCell align="center">
                <SortableHeader field="monthlyRent" label="월세" />
              </TableCell>
            )}
            <TableCell align="center">
              <SortableHeader
                field="exclusiveArea"
                label="전용면적"
                unit={useMetric ? "(m²)" : "(평)"}
              />
            </TableCell>
            <TableCell align="center">
              <SortableHeader
                field="supplyArea"
                label="공급면적"
                unit={useMetric ? "(m²)" : "(평)"}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {propertyList.length > 0 ? (
            propertyList.map((property) => (
              <TableRow key={property.id}>
                <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                  {property.platform}
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                  {CATEGORY_LABELS[property.category]}
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: '150px', whiteSpace: 'normal' }}>
                  {formatBuildingInfo(property)}
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                  {property.address ? (
                    <Tooltip
                      title={
                        <Box>
                          {property.address.road_address && (
                            <div>도로명: {property.address.road_address.address_name}</div>
                          )}
                          {property.address.address && (
                            <div>지번: {property.address.address.address_name}</div>
                          )}
                        </Box>
                      }
                    >
                      <span>
                        {useRoadAddress
                          ? property.address.road_address?.address_name
                          : property.address.address?.address_name || "-"}
                      </span>
                    </Tooltip>
                  ) : "-"}
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                  {property.description ?? "-"}
                </TableCell>
                {showPriceHeader && (
                  <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                    {formatPrice(property.price)}
                  </TableCell>
                )}
                {showDepositHeader && (
                  <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                    {formatPrice(property.deposit)}
                  </TableCell>
                )}
                {showMonthlyRentHeader && (
                  <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                    {property.monthlyRent === 0 ? "-" : `${property.monthlyRent}만`}
                  </TableCell>
                )}
                <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                  {useMetric ? `${property.exclusiveArea}m²` : `${(property.exclusiveArea / 3.3).toFixed(1)}평`}
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                  {useMetric
                    ? `${property.supplyArea == null ? 0 : property.supplyArea}m²`
                    : `${((property.supplyArea == null ? 0 : property.supplyArea) / 3.3).toFixed(1)}평`}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={colSpanCount}
                align="center"
                sx={{
                  padding: "20px 0",
                }}
              >
                매물 데이터가 없습니다
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePageInputSubmit();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handlePageInputSubmit}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                height: '28px',
                '& input': {
                  padding: '0px 8px',
                  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                  '-moz-appearance': 'textfield',
                }
              }
            }}
            sx={{
              width: '110px',
              '& .MuiOutlinedInput-root': {
                height: '28px',
              }
            }}
          />
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            / {totalPages} 페이지
          </Typography>
        </Box>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="페이지당 행 수"
          labelDisplayedRows={({ from, to, count }) => `${count}개 중 ${from}-${to}개`}
        />
      </Box>
    </Box>
  );
};

export default PublicPropertyTable;
