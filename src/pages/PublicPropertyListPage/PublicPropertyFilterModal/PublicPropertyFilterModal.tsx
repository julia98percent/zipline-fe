import apiClient from "@apis/apiClient";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { SearchParams } from "../PublicPropertyListPage";

interface Region {
  cortarNo: number;
  cortarName: string;
  centerLat: number;
  centerLon: number;
  level: number;
  parentCortarNo: number;
}

interface RegionState {
  sido: Region[];
  sigungu: Region[];
  dong: Region[];
  selectedSido: number | null;
  selectedSigungu: number | null;
  selectedDong: number | null;
  [key: string]: Region[] | number | null;
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

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Partial<SearchParams>) => void;
  filters: SearchParams;
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  onSidoChange: (event: SelectChangeEvent<string>) => void;
  onGuChange: (event: SelectChangeEvent<string>) => void;
  onDongChange: (event: SelectChangeEvent<string>) => void;
}

const PublicPropertyFilterModal = ({
  open,
  onClose,
  onApply,
  filters,
}: Props) => {
  // Local state for form values
  const [localFilters, setLocalFilters] = useState<SearchParams>(filters);
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });

  // Load initial region data when modal opens
  const handleOpen = () => {
    apiClient.get("/region/0")
      .then((res) => {
        if (res.data?.data) {
          setRegion(prev => ({ ...prev, sido: res.data.data }));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      handleOpen();
    }
  }, [open, filters]);

  // Load sigungu when sido is selected
  useEffect(() => {
    if (!region.selectedSido) return;
    apiClient.get(`/region/${region.selectedSido}`)
      .then((res) => {
        if (res.data?.data) {
          setRegion(prev => ({
            ...prev,
            sigungu: res.data.data,
            selectedSigungu: null,
            selectedDong: null,
            dong: [],
          }));
        }
      })
      .catch(console.error);
  }, [region.selectedSido]);

  // Load dong when sigungu is selected
  useEffect(() => {
    if (!region.selectedSigungu) return;
    apiClient.get(`/region/${region.selectedSigungu}`)
      .then((res) => {
        if (res.data?.data) {
          setRegion(prev => ({
            ...prev,
            dong: res.data.data,
            selectedDong: null,
          }));
        }
      })
      .catch(console.error);
  }, [region.selectedSigungu]);

  const handleSidoChange = (event: SelectChangeEvent<string>) => {
    const selectedRegion = region.sido.find(item => item.cortarName === event.target.value);
    if (selectedRegion) {
      setRegion(prev => ({
        ...prev,
        selectedSido: selectedRegion.cortarNo,
        selectedSigungu: null,
        selectedDong: null,
        sigungu: [],
        dong: [],
      }));
    }
  };

  const handleGuChange = (event: SelectChangeEvent<string>) => {
    const selectedRegion = region.sigungu.find(item => item.cortarName === event.target.value);
    if (selectedRegion) {
      setRegion(prev => ({
        ...prev,
        selectedSigungu: selectedRegion.cortarNo,
        selectedDong: null,
        dong: [],
      }));
    }
  };

  const handleDongChange = (event: SelectChangeEvent<string>) => {
    const selectedRegion = region.dong.find(item => item.cortarName === event.target.value);
    if (selectedRegion) {
      setRegion(prev => ({
        ...prev,
        selectedDong: selectedRegion.cortarNo,
      }));
    }
  };

  const handleSliderChange = (field: string) => (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setLocalFilters(prev => ({
      ...prev,
      [`min${field}`]: min,
      [`max${field}`]: max,
    }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters(prev => ({
      ...prev,
      category: event.target.value,
    }));
  };

  const handleBuildingTypeChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters(prev => ({
      ...prev,
      buildingType: event.target.value,
    }));
  };

  const handleBuildingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({
      ...prev,
      buildingName: event.target.value,
    }));
  };

  const handleReset = () => {
    setLocalFilters({
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
      minExclusiveArea: undefined,
      maxExclusiveArea: undefined,
      minSupplyArea: undefined,
      maxSupplyArea: undefined,
    });
    setRegion(prev => ({
      ...prev,
      selectedSido: null,
      selectedSigungu: null,
      selectedDong: null,
    }));
    onApply({});
  };

  const handleApply = () => {
    // Create filter object with region code
    const regionCode = region.selectedDong || region.selectedSigungu || region.selectedSido || undefined;
    const updatedFilters = {
      ...localFilters,
      regionCode,
    };
    onApply(updatedFilters);
    onClose();
  };

  const formatPrice = (value: number) => {
    if (value >= 10000) {
      return `${Math.floor(value / 10000)}억 ${value % 10000 > 0 ? `${value % 10000}만` : ''}`;
    }
    return `${value}만`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>상세 필터</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          {/* Location Search Section */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              지역 검색
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="sido-label">시/도</InputLabel>
                  <Select
                    labelId="sido-label"
                    value={region.sido.find(item => item.cortarNo === region.selectedSido)?.cortarName || ""}
                    onChange={handleSidoChange}
                    label="시/도"
                    sx={{ minWidth: '150px' }}
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {region.sido.map((item) => (
                      <MenuItem key={item.cortarNo} value={item.cortarName}>
                        {item.cortarName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="gu-label">구/군</InputLabel>
                  <Select
                    labelId="gu-label"
                    value={region.sigungu.find(item => item.cortarNo === region.selectedSigungu)?.cortarName || ""}
                    onChange={handleGuChange}
                    label="구/군"
                    sx={{ minWidth: '150px' }}
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {region.sigungu.map((item) => (
                      <MenuItem key={item.cortarNo} value={item.cortarName}>
                        {item.cortarName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="dong-label">동</InputLabel>
                  <Select
                    labelId="dong-label"
                    value={region.dong.find(item => item.cortarNo === region.selectedDong)?.cortarName || ""}
                    onChange={handleDongChange}
                    label="동"
                    sx={{ minWidth: '150px' }}
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {region.dong.map((item) => (
                      <MenuItem key={item.cortarNo} value={item.cortarName}>
                        {item.cortarName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Property Type */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>매물 유형</InputLabel>
            <Select
              value={localFilters.category || ""}
              onChange={handleCategoryChange}
              label="매물 유형"
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="SALE">매매</MenuItem>
              <MenuItem value="MONTHLY">월세</MenuItem>
              <MenuItem value="DEPOSIT">전세</MenuItem>
            </Select>
          </FormControl>

          {/* Building Type */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>건물 유형</InputLabel>
            <Select
              value={localFilters.buildingType || ""}
              onChange={handleBuildingTypeChange}
              label="건물 유형"
            >
              <MenuItem value="">전체</MenuItem>
              {BUILDING_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Building Name */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              value={localFilters.buildingName || ""}
              onChange={handleBuildingNameChange}
              label="건물명"
              fullWidth
            />
          </FormControl>

          <Divider sx={{ my: 3 }} />

          {/* Price Ranges */}
          {localFilters.category && (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                가격 범위
              </Typography>

              {/* Sale Price Range */}
              <Box sx={{ mb: 3, display: localFilters.category === "SALE" ? "block" : "none" }}>
                <Typography gutterBottom>매매가 (만원)</Typography>
                <Slider
                  value={[localFilters.minPrice || 10000, localFilters.maxPrice || 100000]}
                  onChange={handleSliderChange("Price")}
                  min={10000}
                  max={100000}
                  step={1000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatPrice}
                />
              </Box>

              {/* Deposit Range */}
              <Box sx={{ mb: 3, display: (localFilters.category === "MONTHLY" || localFilters.category === "DEPOSIT") ? "block" : "none" }}>
                <Typography gutterBottom>보증금 (만원)</Typography>
                <Slider
                  value={[localFilters.minDeposit || 1000, localFilters.maxDeposit || 50000]}
                  onChange={handleSliderChange("Deposit")}
                  min={1000}
                  max={50000}
                  step={1000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatPrice}
                />
              </Box>

              {/* Monthly Rent Range */}
              <Box sx={{ mb: 3, display: localFilters.category === "MONTHLY" ? "block" : "none" }}>
                <Typography gutterBottom>월세 (만원)</Typography>
                <Slider
                  value={[localFilters.minMonthlyRent || 10, localFilters.maxMonthlyRent || 1000]}
                  onChange={handleSliderChange("MonthlyRent")}
                  min={10}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}만`}
                />
              </Box>
            </>
          )}

          {/* Area Ranges */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              면적 범위
            </Typography>
            
            {/* Exclusive Area Range */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>전용면적 (㎡)</Typography>
              <Slider
                value={[localFilters.minExclusiveArea || 10, localFilters.maxExclusiveArea || 200]}
                onChange={handleSliderChange("ExclusiveArea")}
                min={0}
                max={1000}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}㎡`}
              />
            </Box>

            {/* Supply Area Range */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>공급면적 (㎡)</Typography>
              <Slider
                value={[localFilters.minSupplyArea || 10, localFilters.maxSupplyArea || 200]}
                onChange={handleSliderChange("SupplyArea")}
                min={0}
                max={1000}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}㎡`}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>초기화</Button>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleApply} variant="contained">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublicPropertyFilterModal;