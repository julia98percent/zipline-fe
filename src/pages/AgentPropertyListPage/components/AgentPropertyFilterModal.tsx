import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  Divider,
  TextField,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import { AgentPropertySearchParams } from "@apis/propertyService";

interface AgentPropertyFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Partial<AgentPropertySearchParams>) => void;
  filters: AgentPropertySearchParams;
  regions: unknown[];
  selectedSido: string;
  selectedGu: string;
  selectedDong: string;
  onSidoChange: (event: SelectChangeEvent<number>) => void;
  onGuChange: (event: SelectChangeEvent<number>) => void;
  onDongChange: (event: SelectChangeEvent<number>) => void;
}

const AgentPropertyFilterModal = ({
  open,
  onClose,
  onApply,
  filters,
}: AgentPropertyFilterModalProps) => {
  const [customerName, setCustomerName] = useState(filters.customerName || "");
  const [hasElevator, setHasElevator] = useState<boolean | null>(
    filters.hasElevator ?? null
  );
  const [petsAllowed, setPetsAllowed] = useState<boolean | null>(
    filters.petsAllowed ?? null
  );
  const [minNetArea, setMinNetArea] = useState<number>(filters.minNetArea || 0);
  const [maxNetArea, setMaxNetArea] = useState<number>(
    filters.maxNetArea || 200
  );
  const [minTotalArea, setMinTotalArea] = useState<number>(
    filters.minTotalArea || 0
  );
  const [maxTotalArea, setMaxTotalArea] = useState<number>(
    filters.maxTotalArea || 300
  );
  const [minPrice, setMinPrice] = useState<number>(filters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState<number>(filters.maxPrice || 100000);
  const [minDeposit, setMinDeposit] = useState<number>(filters.minDeposit || 0);
  const [maxDeposit, setMaxDeposit] = useState<number>(
    filters.maxDeposit || 50000
  );
  const [minMonthlyRent, setMinMonthlyRent] = useState<number>(
    filters.minMonthlyRent || 0
  );
  const [maxMonthlyRent, setMaxMonthlyRent] = useState<number>(
    filters.maxMonthlyRent || 500
  );
  const [minFloor, setMinFloor] = useState<number>(filters.minFloor || -5);
  const [maxFloor, setMaxFloor] = useState<number>(filters.maxFloor || 50);
  const [minParkingCapacity, setMinParkingCapacity] = useState<number>(
    filters.minParkingCapacity || 0
  );
  const [maxParkingCapacity, setMaxParkingCapacity] = useState<number>(
    filters.maxParkingCapacity || 10
  );
  const [minConstructionYear, setMinConstructionYear] = useState<number>(
    filters.minConstructionYear || 1970
  );
  const [maxConstructionYear, setMaxConstructionYear] = useState<number>(
    filters.maxConstructionYear || new Date().getFullYear()
  );

  const handleApply = () => {
    const cleanedFilters: Partial<AgentPropertySearchParams> = {};

    if (customerName) {
      cleanedFilters.customerName = customerName;
    }

    // Boolean 필터들
    if (hasElevator !== null) {
      cleanedFilters.hasElevator = hasElevator;
    }
    if (petsAllowed !== null) {
      cleanedFilters.petsAllowed = petsAllowed;
    }

    // 범위 필터들 (기본값이 아닌 경우만 적용)
    if (minNetArea > 0 || maxNetArea < 200) {
      cleanedFilters.minNetArea = minNetArea;
      cleanedFilters.maxNetArea = maxNetArea;
    }
    if (minTotalArea > 0 || maxTotalArea < 300) {
      cleanedFilters.minTotalArea = minTotalArea;
      cleanedFilters.maxTotalArea = maxTotalArea;
    }
    if (minPrice > 0 || maxPrice < 100000) {
      cleanedFilters.minPrice = minPrice;
      cleanedFilters.maxPrice = maxPrice;
    }
    if (minDeposit > 0 || maxDeposit < 50000) {
      cleanedFilters.minDeposit = minDeposit;
      cleanedFilters.maxDeposit = maxDeposit;
    }
    if (minMonthlyRent > 0 || maxMonthlyRent < 500) {
      cleanedFilters.minMonthlyRent = minMonthlyRent;
      cleanedFilters.maxMonthlyRent = maxMonthlyRent;
    }
    if (minFloor > -5 || maxFloor < 50) {
      cleanedFilters.minFloor = minFloor;
      cleanedFilters.maxFloor = maxFloor;
    }
    if (minParkingCapacity > 0 || maxParkingCapacity < 10) {
      cleanedFilters.minParkingCapacity = minParkingCapacity;
      cleanedFilters.maxParkingCapacity = maxParkingCapacity;
    }
    if (
      minConstructionYear > 1970 ||
      maxConstructionYear < new Date().getFullYear()
    ) {
      cleanedFilters.minConstructionYear = minConstructionYear;
      cleanedFilters.maxConstructionYear = maxConstructionYear;
    }

    onApply(cleanedFilters);
  };

  const handleReset = () => {
    setCustomerName("");
    setHasElevator(null);
    setPetsAllowed(null);
    setMinNetArea(0);
    setMaxNetArea(200);
    setMinTotalArea(0);
    setMaxTotalArea(300);
    setMinPrice(0);
    setMaxPrice(100000);
    setMinDeposit(0);
    setMaxDeposit(50000);
    setMinMonthlyRent(0);
    setMaxMonthlyRent(500);
    setMinFloor(-5);
    setMaxFloor(50);
    setMinParkingCapacity(0);
    setMaxParkingCapacity(10);
    setMinConstructionYear(1970);
    setMaxConstructionYear(new Date().getFullYear());
    onApply({});
  };

  const handleResetArea = () => {
    setMinNetArea(0);
    setMaxNetArea(200);
    setMinTotalArea(0);
    setMaxTotalArea(300);
  };

  const handleResetPrice = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setMinDeposit(0);
    setMaxDeposit(50000);
    setMinMonthlyRent(0);
    setMaxMonthlyRent(500);
  };

  const handleResetOther = () => {
    setMinFloor(-5);
    setMaxFloor(50);
    setMinParkingCapacity(0);
    setMaxParkingCapacity(10);
    setMinConstructionYear(1970);
    setMaxConstructionYear(new Date().getFullYear());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>상세 필터</DialogTitle>
      <DialogContent dividers>
        <div className="min-h-96 pt-2">
          {/* 건물 특성 */}
          <Typography variant="h6" gutterBottom>
            건물 특성
          </Typography>
          <Box className="flex flex-col gap-3 mb-3">
            <div>
              <Typography variant="subtitle2" className="mb-2">
                엘리베이터
              </Typography>
              <Select
                label="엘리베이터"
                value={hasElevator === null ? "all" : hasElevator.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "all") {
                    setHasElevator(null);
                  } else {
                    setHasElevator(value === "true");
                  }
                }}
                className="w-full"
              >
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="false">없음</MenuItem>
                <MenuItem value="true">있음</MenuItem>
              </Select>
            </div>

            <div>
              <Typography variant="subtitle2" className="mb-2">
                반려동물
              </Typography>
              <Select
                label="반려동물"
                value={petsAllowed === null ? "all" : petsAllowed.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "all") {
                    setPetsAllowed(null);
                  } else {
                    setPetsAllowed(value === "true");
                  }
                }}
                className="w-full"
              >
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="false">불가</MenuItem>
                <MenuItem value="true">가능</MenuItem>
              </Select>
            </div>
          </Box>

          <Divider className="my-6" />

          {/* 면적 범위 */}
          <div className="flex items-center justify-between mb-2">
            <Typography variant="h6">면적 범위</Typography>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleResetArea}
              className="text-xs min-w-0 px-3"
            >
              초기화
            </Button>
          </div>
          <div className="mb-6">
            <Typography variant="subtitle2" gutterBottom>
              전용 면적: {minNetArea}m² - {maxNetArea}m²
            </Typography>
            <div className="flex items-center gap-2 mb-4">
              <TextField
                label="최소 (m²)"
                type="number"
                size="small"
                value={minNetArea}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setMinNetArea(Math.min(value, maxNetArea));
                }}
                className="w-30"
              />
              <Slider
                value={[minNetArea, maxNetArea]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinNetArea(min);
                  setMaxNetArea(max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={200}
                step={5}
                className="flex-1"
              />
              <TextField
                label="최대 (m²)"
                type="number"
                size="small"
                value={maxNetArea}
                onChange={(e) => {
                  const value = Math.min(200, parseInt(e.target.value) || 200);
                  setMaxNetArea(Math.max(value, minNetArea));
                }}
                className="w-30"
              />
            </div>

            <Typography variant="subtitle2" gutterBottom>
              공급 면적: {minTotalArea}m² - {maxTotalArea}m²
            </Typography>
            <div className="flex items-center gap-2">
              <TextField
                label="최소 (m²)"
                type="number"
                size="small"
                value={minTotalArea}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setMinTotalArea(Math.min(value, maxTotalArea));
                }}
                className="w-30"
              />
              <Slider
                value={[minTotalArea, maxTotalArea]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinTotalArea(min);
                  setMaxTotalArea(max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={300}
                step={5}
                className="flex-1"
              />
              <TextField
                label="최대 (m²)"
                type="number"
                size="small"
                value={maxTotalArea}
                onChange={(e) => {
                  const value = Math.min(300, parseInt(e.target.value) || 300);
                  setMaxTotalArea(Math.max(value, minTotalArea));
                }}
                className="w-30"
              />
            </div>
          </div>

          <Divider sx={{ my: 3 }} />

          {/* 가격 범위 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h6">가격 범위 (만원)</Typography>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleResetPrice}
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1.5 }}
            >
              초기화
            </Button>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              매매가: {minPrice.toLocaleString()}만원 -{" "}
              {maxPrice.toLocaleString()}만원
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TextField
                label="최소 (만원)"
                type="number"
                size="small"
                value={minPrice}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setMinPrice(Math.min(value, maxPrice));
                }}
                sx={{ width: 140 }}
              />
              <Slider
                value={[minPrice, maxPrice]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={1000}
                sx={{ flex: 1 }}
              />
              <TextField
                label="최대 (만원)"
                type="number"
                size="small"
                value={maxPrice}
                onChange={(e) => {
                  const value = Math.min(
                    100000,
                    parseInt(e.target.value) || 100000
                  );
                  setMaxPrice(Math.max(value, minPrice));
                }}
                sx={{ width: 140 }}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              보증금: {minDeposit.toLocaleString()}만원 -{" "}
              {maxDeposit.toLocaleString()}만원
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TextField
                label="최소 (만원)"
                type="number"
                size="small"
                value={minDeposit}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setMinDeposit(Math.min(value, maxDeposit));
                }}
                sx={{ width: 140 }}
              />
              <Slider
                value={[minDeposit, maxDeposit]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinDeposit(min);
                  setMaxDeposit(max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={50000}
                step={500}
                sx={{ flex: 1 }}
              />
              <TextField
                label="최대 (만원)"
                type="number"
                size="small"
                value={maxDeposit}
                onChange={(e) => {
                  const value = Math.min(
                    50000,
                    parseInt(e.target.value) || 50000
                  );
                  setMaxDeposit(Math.max(value, minDeposit));
                }}
                sx={{ width: 140 }}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              월세: {minMonthlyRent}만원 - {maxMonthlyRent}만원
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="최소 (만원)"
                type="number"
                size="small"
                value={minMonthlyRent}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setMinMonthlyRent(Math.min(value, maxMonthlyRent));
                }}
                sx={{ width: 140 }}
              />
              <Slider
                value={[minMonthlyRent, maxMonthlyRent]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinMonthlyRent(min);
                  setMaxMonthlyRent(max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={500}
                step={10}
                sx={{ flex: 1 }}
              />
              <TextField
                label="최대 (만원)"
                type="number"
                size="small"
                value={maxMonthlyRent}
                onChange={(e) => {
                  const value = Math.min(500, parseInt(e.target.value) || 500);
                  setMaxMonthlyRent(Math.max(value, minMonthlyRent));
                }}
                sx={{ width: 140 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 기타 조건 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h6">기타 조건</Typography>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleResetOther}
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1.5 }}
            >
              초기화
            </Button>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              층수: {minFloor}층 - {maxFloor}층
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TextField
                label="최소 (층)"
                type="number"
                size="small"
                value={minFloor}
                onChange={(e) => {
                  const value = Math.max(-5, parseInt(e.target.value) || -5);
                  setMinFloor(Math.min(value, maxFloor));
                }}
                sx={{ width: 120 }}
              />
              <Slider
                value={[minFloor, maxFloor]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinFloor(min);
                  setMaxFloor(max);
                }}
                valueLabelDisplay="auto"
                min={-5}
                max={50}
                step={1}
                sx={{ flex: 1 }}
              />
              <TextField
                label="최대 (층)"
                type="number"
                size="small"
                value={maxFloor}
                onChange={(e) => {
                  const value = Math.min(50, parseInt(e.target.value) || 50);
                  setMaxFloor(Math.max(value, minFloor));
                }}
                sx={{ width: 120 }}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              주차 가능 대수: {minParkingCapacity}대 - {maxParkingCapacity}대
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TextField
                label="최소 (대)"
                type="number"
                size="small"
                value={minParkingCapacity}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setMinParkingCapacity(Math.min(value, maxParkingCapacity));
                }}
                sx={{ width: 120 }}
              />
              <Slider
                value={[minParkingCapacity, maxParkingCapacity]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinParkingCapacity(min);
                  setMaxParkingCapacity(max);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={1}
                sx={{ flex: 1 }}
              />
              <TextField
                label="최대 (대)"
                type="number"
                size="small"
                value={maxParkingCapacity}
                onChange={(e) => {
                  const value = Math.min(10, parseInt(e.target.value) || 10);
                  setMaxParkingCapacity(Math.max(value, minParkingCapacity));
                }}
                sx={{ width: 120 }}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              건축년도: {minConstructionYear}년 - {maxConstructionYear}년
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="최소 (년)"
                type="number"
                size="small"
                value={minConstructionYear}
                onChange={(e) => {
                  const value = Math.max(
                    1970,
                    parseInt(e.target.value) || 1970
                  );
                  setMinConstructionYear(Math.min(value, maxConstructionYear));
                }}
                sx={{ width: 120 }}
              />
              <Slider
                value={[minConstructionYear, maxConstructionYear]}
                onChange={(_, newValue) => {
                  const [min, max] = newValue as number[];
                  setMinConstructionYear(min);
                  setMaxConstructionYear(max);
                }}
                valueLabelDisplay="auto"
                min={1970}
                max={new Date().getFullYear()}
                step={1}
                sx={{ flex: 1 }}
              />
              <TextField
                label="최대 (년)"
                type="number"
                size="small"
                value={maxConstructionYear}
                onChange={(e) => {
                  const value = Math.min(
                    new Date().getFullYear(),
                    parseInt(e.target.value) || new Date().getFullYear()
                  );
                  setMaxConstructionYear(Math.max(value, minConstructionYear));
                }}
                sx={{ width: 120 }}
              />
            </Box>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary">
          전체 필터 초기화
        </Button>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleApply} variant="contained">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentPropertyFilterModal;
