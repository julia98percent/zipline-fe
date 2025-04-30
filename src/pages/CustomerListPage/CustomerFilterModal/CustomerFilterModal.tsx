import { Modal, Box, Typography, FormControlLabel, Checkbox, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import apiClient from "@apis/apiClient";

interface Region {
  cortarNo: number;
  cortarName: string;
  centerLat: number;
  centerLon: number;
  level: number;
  parentCortarNo: number;
}

interface Label {
  uid: number;
  name: string;
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

interface FilterState {
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
  noRole: boolean;
  minPrice: string;
  maxPrice: string;
  minDeposit: string;
  maxDeposit: string;
  minRent: string;
  maxRent: string;
  labelUids: number[];
  [key: string]: boolean | string | number[];
}

interface CustomerFilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: any;                     // 🔥 부모에서 관리하는 필터
  setFilters: (filters: any) => void; // 🔥 부모 setter
  onApply: (filters: any) => void;    // 🔥 적용 시 호출
}

const CustomerFilterModal = ({ open, onClose, filters, setFilters, onApply }: CustomerFilterModalProps) => {
  const [filtersTemp, setFiltersTemp] = useState<FilterState>({
    ...filters,
    noRole: false,
    labelUids: [],
  });
  const [region, setRegion] = useState<RegionState>({
    sido: [],
    sigungu: [],
    dong: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedDong: null,
  });
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  // 라벨 목록 불러오기
  const fetchLabels = async () => {
    try {
      const response = await apiClient.get("/labels");
      if (response.data?.data?.labels) {
        setLabels(response.data.data.labels);
      }
    } catch (error) {
      console.error("라벨 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLabels();
      setFiltersTemp(filters);
      handleOpen();

      // 기존에 선택된 라벨들 복원
      if (filters.labelUids?.length > 0) {
        const selectedLabelsData = labels.filter(label =>
          filters.labelUids.includes(label.uid)
        );
        setSelectedLabels(selectedLabelsData);
      }
    } else {
      setRegion({
        sido: [],
        sigungu: [],
        dong: [],
        selectedSido: null,
        selectedSigungu: null,
        selectedDong: null,
      });
    }
  }, [open, filters]);

  // 라벨 선택 처리
  const handleLabelSelect = (label: Label) => {
    const isSelected = selectedLabels.some(l => l.uid === label.uid);
    let newSelectedLabels: Label[];

    if (isSelected) {
      newSelectedLabels = selectedLabels.filter(l => l.uid !== label.uid);
    } else {
      newSelectedLabels = [...selectedLabels, label];
    }

    setSelectedLabels(newSelectedLabels);
    setFiltersTemp(prev => ({
      ...prev,
      labelUids: newSelectedLabels.map(l => l.uid)
    }));
  };

  const handleOpen = () => {
    apiClient.get("/region/0")
      .then((res) => {
        if (res.data?.data) {
          setRegion(prev => ({ ...prev, sido: res.data.data }));
        }
      })
      .catch(console.error);
  };

  // 시/도 선택 시 군구 불러오기
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

  // 군구 선택 시 동 불러오기
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

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;

    if (name === 'noRole') {
      if (value) {
        setFiltersTemp((prev: FilterState) => ({
          ...prev,
          noRole: true,
          tenant: false,
          landlord: false,
          buyer: false,
          seller: false
        }));
      } else {
        setFiltersTemp((prev: FilterState) => ({
          ...prev,
          noRole: false
        }));
      }
    } else if (['tenant', 'landlord', 'buyer', 'seller'].includes(name)) {
      if (value) {
        setFiltersTemp((prev: FilterState) => ({
          ...prev,
          [name]: value,
          noRole: false
        }));
      } else {
        setFiltersTemp((prev: FilterState) => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFiltersTemp((prev: FilterState) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRegionChange = (type: 'sido' | 'sigungu' | 'dong') => (event: any) => {
    const value = event.target.value;
    setRegion(prev => ({
      ...prev,
      [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: value
    }));
  };

  const handleApply = () => {
    // 쉼표가 포함된 문자열에서 숫자만 추출
    const parsePrice = (price: string) => {
      if (!price) return undefined;
      return Number(price.replace(/[^0-9]/g, ''));
    };

    const filterData = {
      ...filtersTemp,
      minPrice: parsePrice(filtersTemp.minPrice as string),
      maxPrice: parsePrice(filtersTemp.maxPrice as string),
      minDeposit: parsePrice(filtersTemp.minDeposit as string),
      maxDeposit: parsePrice(filtersTemp.maxDeposit as string),
      minRent: parsePrice(filtersTemp.minRent as string),
      maxRent: parsePrice(filtersTemp.maxRent as string),
      regionCode: region.selectedDong || region.selectedSigungu || region.selectedSido || undefined,
      labelUids: selectedLabels.length > 0 ? selectedLabels.map(label => label.uid) : undefined,
    };

    // undefined 값을 가진 필드는 제거하되, '없음' 선택 시에는 모든 역할을 명시적으로 false로 설정
    const finalFilterData = Object.fromEntries(
      Object.entries(filterData)
        .filter(([key, value]) => {
          if (filtersTemp.noRole && ["tenant", "landlord", "buyer", "seller"].includes(key)) {
            return true;  // 역할 관련 키는 모두 포함
          }
          return value !== undefined;  // 나머지는 undefined가 아닌 경우만 포함
        })
        .map(([key, value]) => {
          if (filtersTemp.noRole && ["tenant", "landlord", "buyer", "seller"].includes(key)) {
            return [key, false];  // 역할 관련 키는 모두 false로 설정
          }
          return [key, value];
        })
    );

    onApply(finalFilterData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          고객 필터
        </Typography>

        {/* 역할 필터 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            고객 역할
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={filtersTemp.noRole}
                onChange={handleChange('noRole')}
              />
            }
            label="없음"
          />
          {["tenant", "landlord", "buyer", "seller"].map(role => (
            <FormControlLabel
              key={role}
              control={
                <Checkbox
                  checked={filtersTemp[role]}
                  onChange={handleChange(role)}
                  disabled={filtersTemp.noRole}
                />
              }
              label={role === "tenant" ? "임차인" : role === "landlord" ? "임대인" : role === "buyer" ? "매수인" : "매도인"}
            />
          ))}
        </Box>

        {/* 지역 필터 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>지역</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["sido", "sigungu", "dong"].map((type) => (
              <FormControl fullWidth key={type}>
                <InputLabel>{type === "sido" ? "시/도" : type === "sigungu" ? "시/군/구" : "읍/면/동"}</InputLabel>
                <Select
                  value={region[`selected${type.charAt(0).toUpperCase() + type.slice(1)}`] || ''}
                  onChange={handleRegionChange(type as any)}
                  label={type === "sido" ? "시/도" : type === "sigungu" ? "시/군/구" : "읍/면/동"}
                  disabled={type !== "sido" && !region[`selected${type === "dong" ? "Sigungu" : "Sido"}`]}
                >
                  {region[type].map((item: any) => (
                    <MenuItem key={item.cortarNo} value={item.cortarNo}>
                      {item.cortarName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>
        </Box>

        {/* 금액 필터 */}
        {["매매가", "보증금", "월세"].map((label, idx) => (
          <Box key={label} sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>희망 {label}</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="최소"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={filtersTemp[`min${["Price", "Deposit", "Rent"][idx]}`]}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  const formattedValue = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  handleChange(`min${["Price", "Deposit", "Rent"][idx]}`)(
                    { target: { value: formattedValue, type: "text" } }
                  );
                }}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
              />
              <TextField
                label="최대"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={filtersTemp[`max${["Price", "Deposit", "Rent"][idx]}`]}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  const formattedValue = value ? new Intl.NumberFormat('ko-KR').format(Number(value)) : '';
                  handleChange(`max${["Price", "Deposit", "Rent"][idx]}`)(
                    { target: { value: formattedValue, type: "text" } }
                  );
                }}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
              />
            </Box>
          </Box>
        ))}

        {/* 라벨 필터 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            라벨
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {labels.map((label) => (
              <Chip
                key={label.uid}
                label={label.name}
                onClick={() => handleLabelSelect(label)}
                onDelete={
                  selectedLabels.some(l => l.uid === label.uid)
                    ? () => handleLabelSelect(label)
                    : undefined
                }
                sx={{
                  backgroundColor: selectedLabels.some(l => l.uid === label.uid)
                    ? '#6366F1'
                    : 'transparent',
                  color: selectedLabels.some(l => l.uid === label.uid)
                    ? 'white'
                    : 'inherit',
                  border: '1px solid #6366F1',
                  '&:hover': {
                    backgroundColor: selectedLabels.some(l => l.uid === label.uid)
                      ? '#5457E5'
                      : 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 버튼 영역 */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} variant="outlined">취소</Button>
          <Button onClick={handleApply} variant="contained" sx={{ backgroundColor: "#164F9E" }}>
            적용하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerFilterModal;
