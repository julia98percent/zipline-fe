import { useState, useCallback, useEffect } from "react";
import apiClient from "@apis/apiClient";
import PublicPropertyTable from "./PublicPropertyTable";
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Slider,
  Grid,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CORTAR_NO from "./PublicPropertyTable/cortarNo.json";

export interface PublicPropertyItem {
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

export interface SearchParams {
  page: number;
  size: number;
  sortFields: {
    [key: string]: string;
  };
  regionCode?: string;
  buildingName?: string;
  buildingType?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDeposit?: number;
  maxDeposit?: number;
  minMonthlyRent?: number;
  maxMonthlyRent?: number;
  minArea?: number;
  maxArea?: number;
}

const BUILDING_TYPES = [
  "단독/다가구",
  "사무실",
  "건물",
  "빌라",
  "상가",
  "토지",
  "상가주택",
  "아파트",
  "한옥주택",
  "연립",
  "오피스텔",
  "다세대",
  "원룸",
  "재개발",
  "고시원",
  "공장/창고",
  "지식산업센터",
  "아파트분양권",
  "오피스텔분양권",
  "재건축",
  "전원주택",
];

const CATEGORY_OPTIONS = [
  { value: "SALE", label: "매매" },
  { value: "MONTHLY", label: "월세" },
  { value: "DEPOSIT", label: "전세" },
];

function PublicPropertyListPage() {
  const [publicPropertyList, setPublicPropertyList] = useState<PublicPropertyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Location fields
  const [selectedGu, setSelectedGu] = useState("");
  const [selectedDong, setSelectedDong] = useState("");
  const [selectedRegionCode, setSelectedRegionCode] = useState("");

  // Search params
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 0,
    size: 20,
    sortFields: { id: "ASC" },
    category: "",
    buildingType: "",
    buildingName: "",
    minPrice: undefined,
    maxPrice: undefined,
    minDeposit: undefined,
    maxDeposit: undefined,
    minMonthlyRent: undefined,
    maxMonthlyRent: undefined,
    minArea: undefined,
    maxArea: undefined,
  });

  // Area slider values
  const [areaRange, setAreaRange] = useState<number[]>([10, 185]);

  // Price slider values based on category
  const [priceRange, setPriceRange] = useState<number[]>([100000, 2000000]);
  const [depositRange, setDepositRange] = useState<number[]>([100000, 2000000]);
  const [monthlyRentRange, setMonthlyRentRange] = useState<number[]>([50, 2000]);

  // Handle location selection
  const handleGuChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSelectedGu(value);
    setSelectedDong("");
    setSelectedRegionCode("");
  };

  const handleDongChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSelectedDong(value);

    // Find the selected dong code
    if (value) {
      const selectedGu = CORTAR_NO["서울시"].find(gu => gu.name === selectedGu);
      const selectedDongObj = selectedGu?.districts.find(dong => dong.name === value);
      if (selectedDongObj) {
        setSelectedRegionCode(selectedDongObj.code);
        // Update search params with the new region code
        setSearchParams(prev => ({ ...prev, regionCode: selectedDongObj.code }));
      }
    } else {
      setSelectedRegionCode("");
    }
  };

  // Handle category change and show/hide relevant price fields
  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSearchParams(prev => ({ ...prev, category: value }));
  };

  // Handle building type change
  const handleBuildingTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSearchParams(prev => ({ ...prev, buildingType: value }));
  };

  // Handle building name change
  const handleBuildingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, buildingName: value }));
  };

  // Handle area range change
  const handleAreaRangeChange = (event: Event, newValue: number | number[]) => {
    const values = newValue as number[];
    setAreaRange(values);
    setSearchParams(prev => ({
      ...prev,
      minArea: values[0],
      maxArea: values[1]
    }));
  };

  // Handle price range changes
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const values = newValue as number[];
    setPriceRange(values);
    setSearchParams(prev => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1]
    }));
  };

  const handleDepositRangeChange = (event: Event, newValue: number | number[]) => {
    const values = newValue as number[];
    setDepositRange(values);
    setSearchParams(prev => ({
      ...prev,
      minDeposit: values[0],
      maxDeposit: values[1]
    }));
  };

  const handleMonthlyRentRangeChange = (event: Event, newValue: number | number[]) => {
    const values = newValue as number[];
    setMonthlyRentRange(values);
    setSearchParams(prev => ({
      ...prev,
      minMonthlyRent: values[0],
      maxMonthlyRent: values[1]
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedGu("");
    setSelectedDong("");
    setSelectedRegionCode("");
    setAreaRange([10, 185]);
    setPriceRange([100000, 2000000]);
    setDepositRange([100000, 2000000]);
    setMonthlyRentRange([50, 2000]);
    setSearchParams({
      page: 0,
      size: 20,
      sortFields: { id: "ASC" },
      category: "",
      buildingType: "",
      buildingName: "",
      regionCode: "",
    });
  };

  // Fetch property data with all search parameters
  const fetchPropertyData = useCallback(() => {
    setLoading(true);

    // Construct query parameters
    const queryParams = new URLSearchParams();

    // Add pagination and sorting
    queryParams.append("page", searchParams.page.toString());
    queryParams.append("size", searchParams.size.toString());
    queryParams.append("sortFields", JSON.stringify(searchParams.sortFields));

    // Add region code if available
    if (searchParams.regionCode) {
      queryParams.append("regionCode", searchParams.regionCode);
    }

    // Add building filters if available
    if (searchParams.buildingName) {
      queryParams.append("buildingName", searchParams.buildingName);
    }

    if (searchParams.buildingType) {
      queryParams.append("buildingType", searchParams.buildingType);
    }

    // Add category if available
    if (searchParams.category) {
      queryParams.append("category", searchParams.category);
    }

    // Add price ranges based on category
    if (searchParams.category === "SALE" || !searchParams.category) {
      if (searchParams.minPrice !== undefined) {
        queryParams.append("minPrice", searchParams.minPrice.toString());
      }
      if (searchParams.maxPrice !== undefined) {
        queryParams.append("maxPrice", searchParams.maxPrice.toString());
      }
    }

    if (searchParams.category === "MONTHLY" || searchParams.category === "DEPOSIT" || !searchParams.category) {
      if (searchParams.minDeposit !== undefined) {
        queryParams.append("minDeposit", searchParams.minDeposit.toString());
      }
      if (searchParams.maxDeposit !== undefined) {
        queryParams.append("maxDeposit", searchParams.maxDeposit.toString());
      }
    }

    if (searchParams.category === "MONTHLY" || !searchParams.category) {
      if (searchParams.minMonthlyRent !== undefined) {
        queryParams.append("minMonthlyRent", searchParams.minMonthlyRent.toString());
      }
      if (searchParams.maxMonthlyRent !== undefined) {
        queryParams.append("maxMonthlyRent", searchParams.maxMonthlyRent.toString());
      }
    }

    // Add area range if available
    if (searchParams.minArea !== undefined && searchParams.minArea !== 10) {
      queryParams.append("minArea", searchParams.minArea.toString());
    }
    if (searchParams.maxArea !== undefined && searchParams.maxArea !== 185) {
      queryParams.append("maxArea", searchParams.maxArea.toString());
    }

    // Make API call
    apiClient
      .get(`/property-articles/search?${queryParams.toString()}`)
      .then((res) => {
        const propertyData = res?.data?.content;
        if (propertyData) {
          setPublicPropertyList(propertyData);
        } else {
          setPublicPropertyList([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch properties:", error);
        setPublicPropertyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  // Search button handler
  const handleSearch = () => {
    fetchPropertyData();
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return value >= 10000
      ? `${Math.floor(value / 10000)}억 ${value % 10000 > 0 ? `${value % 10000}만` : ''}`
      : `${value}만`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "32px" }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            공개 매물 검색
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
            >
              초기화
            </Button>
            <Button
              startIcon={<FilterListIcon />}
              color={showAdvancedFilters ? "primary" : "inherit"}
              variant={showAdvancedFilters ? "contained" : "outlined"}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              범위 검색
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              검색
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Search Section */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="gu-label">구</InputLabel>
              <Select
                labelId="gu-label"
                value={selectedGu}
                onChange={handleGuChange}
                label="구"
              >
                <MenuItem value="">
                  <em>구 선택</em>
                </MenuItem>
                {CORTAR_NO["서울시"].map((gu) => (
                  <MenuItem key={gu.code} value={gu.name}>
                    {gu.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal" disabled={!selectedGu}>
              <InputLabel id="dong-label">동</InputLabel>
              <Select
                labelId="dong-label"
                value={selectedDong}
                onChange={handleDongChange}
                label="동"
              >
                <MenuItem value="">
                  <em>동 선택</em>
                </MenuItem>
                {selectedGu &&
                  CORTAR_NO["서울시"]
                    .find((gu) => gu.name === selectedGu)
                    ?.districts.map((dong) => (
                      <MenuItem key={dong.code} value={dong.name}>
                        {dong.name}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">매물 유형</InputLabel>
              <Select
                labelId="category-label"
                value={searchParams.category}
                onChange={handleCategoryChange}
                label="매물 유형"
              >
                <MenuItem value="">
                  <em>전체</em>
                </MenuItem>
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="building-type-label">건물 유형</InputLabel>
              <Select
                labelId="building-type-label"
                value={searchParams.buildingType}
                onChange={handleBuildingTypeChange}
                label="건물 유형"
              >
                <MenuItem value="">
                  <em>전체</em>
                </MenuItem>
                {BUILDING_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="normal"
              label="건물명"
              value={searchParams.buildingName || ""}
              onChange={handleBuildingNameChange}
              placeholder="건물명 입력"
            />
          </Grid>
        </Grid>

        {/* Advanced Filters Section */}
        {showAdvancedFilters && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              면적 범위 (㎡)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={areaRange}
                onChange={handleAreaRangeChange}
                valueLabelDisplay="auto"
                min={10}
                max={185}
                step={5}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {areaRange[0]} ㎡
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {areaRange[1]} ㎡
                </Typography>
              </Box>
            </Box>

            {/* Show price sliders based on category */}
            {(!searchParams.category || searchParams.category === "SALE") && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  매매가 범위 (만원)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    valueLabelDisplay="auto"
                    min={100000}
                    max={2000000}
                    step={10000}
                    valueLabelFormat={(value) => formatCurrency(value)}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(priceRange[0])}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(priceRange[1])}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {(!searchParams.category || searchParams.category === "DEPOSIT" || searchParams.category === "MONTHLY") && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  보증금 범위 (만원)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={depositRange}
                    onChange={handleDepositRangeChange}
                    valueLabelDisplay="auto"
                    min={100000}
                    max={2000000}
                    step={10000}
                    valueLabelFormat={(value) => formatCurrency(value)}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(depositRange[0])}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(depositRange[1])}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {(!searchParams.category || searchParams.category === "MONTHLY") && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  월세 범위 (만원)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={monthlyRentRange}
                    onChange={handleMonthlyRentRangeChange}
                    valueLabelDisplay="auto"
                    min={50}
                    max={2000}
                    step={50}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {monthlyRentRange[0]} 만원
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {monthlyRentRange[1]} 만원
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </>
        )}
      </Paper>

      {/* Results Section */}
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          검색 결과 {publicPropertyList.length}건
        </Typography>
        <PublicPropertyTable propertyList={publicPropertyList} />
      </Paper>
    </Box >
  );
}

export default PublicPropertyListPage;
