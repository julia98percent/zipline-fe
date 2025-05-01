import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PublicPropertyItem } from "../PublicPropertyListPage";

interface Props {
  propertyList: PublicPropertyItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onSort: (field: string) => void;
  sortFields: { [key: string]: string };
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
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortFields
}: Props) => {
  const [useMetric, setUseMetric] = useState(true);
  const [useRoadAddress, setUseRoadAddress] = useState(true);
  const [pageInput, setPageInput] = useState<string>('');

  const formatArea = (supplyArea: number, exclusiveArea: number) => {
    return useMetric
      ? `${exclusiveArea}m² / ${supplyArea}m²`
      : `${(exclusiveArea / 3.3).toFixed(1)}평 / ${(supplyArea / 3.3).toFixed(1)}평`;
  };

  const formatPrice = (value: number) => {
    if (value === 0) return "-";
    return value >= 10000
      ? `${Math.floor(value / 10000)}억 ${value % 10000 > 0 ? `${value % 10000}만` : ''}`
      : `${value}만`;
  };

  const handleToggleUnitChange = () => {
    setUseMetric(!useMetric);
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

  // Check if the list is filtered by category
  const isFilteredByCategory = (category: string) => {
    return propertyList.length > 0 && propertyList.every(p => p.category === category);
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

  return (
    <Box sx={{ width: "100%", mt: 0 }}>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'end', gap: 1, mb: 2 }}>
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
        <FormControlLabel
          control={
            <Switch
              checked={useRoadAddress}
              onChange={() => setUseRoadAddress(!useRoadAddress)}
              color="primary"
            />
          }
          label={useRoadAddress ? "도로명 주소" : "지번 주소"}
        />
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <SortableHeader field="id" label="매물 ID" />
                </TableCell>
                <TableCell align="center">매물 유형</TableCell>
                <TableCell align="center">건물 정보</TableCell>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">설명</TableCell>
                {!isFilteredByCategory('MONTHLY') && !isFilteredByCategory('DEPOSIT') && (
                  <TableCell align="center">
                    <SortableHeader field="price" label="매매 가격" />
                  </TableCell>
                )}
                {!isFilteredByCategory('SALE') && (
                  <TableCell align="center">
                    <SortableHeader field="deposit" label="보증금" />
                  </TableCell>
                )}
                {!isFilteredByCategory('SALE') && !isFilteredByCategory('DEPOSIT') && (
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
                <TableCell align="center">플랫폼</TableCell>
                <TableCell align="center">
                  <SortableHeader field="createdAt" label="등록일" />
                </TableCell>
                <TableCell align="center">
                  <SortableHeader field="updatedAt" label="수정일" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propertyList.length > 0 ? (
                propertyList.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                      {property.id}
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
                    {!isFilteredByCategory('MONTHLY') && !isFilteredByCategory('DEPOSIT') ? (
                      <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                        {formatPrice(property.price)}
                      </TableCell>
                    ) : (
                      <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                        -
                      </TableCell>
                    )}
                    {!isFilteredByCategory('SALE') ? (
                      <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                        {formatPrice(property.deposit)}
                      </TableCell>
                    ) : (
                      <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                        -
                      </TableCell>
                    )}
                    {!isFilteredByCategory('SALE') && !isFilteredByCategory('DEPOSIT') ? (
                      <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                        {property.monthlyRent === 0 ? "-" : `${property.monthlyRent}만`}
                      </TableCell>
                    ) : (
                      <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                        -
                      </TableCell>
                    )}
                    <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                      {useMetric ? `${property.exclusiveArea}m²` : `${(property.exclusiveArea / 3.3).toFixed(1)}평`}
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                      {useMetric ? `${property.supplyArea}m²` : `${(property.supplyArea / 3.3).toFixed(1)}평`}
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                      {property.platformUrl ? (
                        <Tooltip title={`${property.platform} 부동산으로 이동`}>
                          <Link
                            //href={property.platformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              cursor: 'pointer',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {property.platform}
                          </Link>
                        </Tooltip>
                      ) : property.platform}
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                      {new Date(property.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: '100px', whiteSpace: 'normal' }}>
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={12}
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
        </TableContainer>
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
                  height: '32px',
                  '& input': {
                    padding: '4px 8px',
                    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
                      '-webkit-appearance': 'none',
                      margin: 0,
                    },
                    '-moz-appearance': 'textfield',
                  }
                }
              }}
              sx={{
                width: '150px',
                '& .MuiOutlinedInput-root': {
                  height: '32px',
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
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="페이지당 행"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default PublicPropertyTable;
