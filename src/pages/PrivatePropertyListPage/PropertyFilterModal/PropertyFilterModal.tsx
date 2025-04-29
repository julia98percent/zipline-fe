import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";

import { PropertyItem } from "../PrivatePropertyListPage";

interface Props {
  open: boolean;
  onClose: () => void;
  filter: Partial<FilterRequest>;
  setFilter: (value: Partial<FilterRequest>) => void;
  onApply: () => void;
  onReset: () => void;
}

interface FilterRequest {
  type: PropertyItem["type"];
  category: PropertyItem["realCategory"];
  hasElevator: boolean;
  petsAllowed: boolean;
  minNetArea: number;
  maxNetArea: number;
  minDeposit: number;
  maxDeposit: number;
  minMonthlyRent: number;
  maxMonthlyRent: number;
  minPrice: number;
  maxPrice: number;
  minFloor: number;
  maxFloor: number;
  minParkingCapacity: number;
  maxParkingCapacity: number;
  minConstructionYear: number;
  maxConstructionYear: number;
}

const PropertyFilterModal = ({
  open,
  onClose,
  filter,
  setFilter,
  onApply,
  onReset,
}: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FilterRequest
  ) => {
    const value = Number(e.target.value);
    if (value < 0) return; // 음수 입력 거부
    setFilter({ ...filter, [field]: value });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ value: unknown }>,
    field: keyof FilterRequest
  ) => {
    setFilter({ ...filter, [field]: e.target.value as unknown });
  };

  const handleSwitchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FilterRequest
  ) => {
    setFilter({ ...filter, [field]: e.target.checked });
  };

  const handleApply = () => {
    // 최소 > 최대 입력 오류 검사
    if (
      (filter.minNetArea !== undefined &&
        filter.maxNetArea !== undefined &&
        filter.minNetArea > filter.maxNetArea) ||
      (filter.minDeposit !== undefined &&
        filter.maxDeposit !== undefined &&
        filter.minDeposit > filter.maxDeposit) ||
      (filter.minMonthlyRent !== undefined &&
        filter.maxMonthlyRent !== undefined &&
        filter.minMonthlyRent > filter.maxMonthlyRent) ||
      (filter.minPrice !== undefined &&
        filter.maxPrice !== undefined &&
        filter.minPrice > filter.maxPrice) ||
      (filter.minFloor !== undefined &&
        filter.maxFloor !== undefined &&
        filter.minFloor > filter.maxFloor) ||
      (filter.minParkingCapacity !== undefined &&
        filter.maxParkingCapacity !== undefined &&
        filter.minParkingCapacity > filter.maxParkingCapacity) ||
      (filter.minConstructionYear !== undefined &&
        filter.maxConstructionYear !== undefined &&
        filter.minConstructionYear > filter.maxConstructionYear)
    ) {
      setError("최소값이 최대값보다 클 수 없습니다.");
      return;
    }
    setError(null);
    onApply();
  };

  useEffect(() => {
    setError(null);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>필터</DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {/* 매물 유형 */}
        <FormControl fullWidth>
          <InputLabel>매물유형</InputLabel>
          <Select
            value={filter.category || ""}
            onChange={(e) => handleSelectChange(e, "category")}
          >
            <MenuItem value="APARTMENT">아파트</MenuItem>
            <MenuItem value="ONE_ROOM">원룸</MenuItem>
            <MenuItem value="TWO_ROOM">투룸</MenuItem>
            <MenuItem value="HOUSE">주택</MenuItem>
            <MenuItem value="OFFICETEL">오피스텔</MenuItem>
            <MenuItem value="COMMERCIAL">상가</MenuItem>
            <MenuItem value="VILLA">빌라</MenuItem>
          </Select>
        </FormControl>

        {/* 판매 유형 */}
        <FormControl fullWidth>
          <InputLabel>판매유형</InputLabel>
          <Select
            value={filter.type || ""}
            onChange={(e) => handleSelectChange(e, "type")}
          >
            <MenuItem value="SALE">매매</MenuItem>
            <MenuItem value="DEPOSIT">전세</MenuItem>
            <MenuItem value="MONTHLY">월세</MenuItem>
          </Select>
        </FormControl>

        {/* 엘리베이터, 반려동물 */}
        <Box display="flex" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={filter.hasElevator || false}
                onChange={(e) => handleSwitchChange(e, "hasElevator")}
              />
            }
            label="엘리베이터 있음"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filter.petsAllowed || false}
                onChange={(e) => handleSwitchChange(e, "petsAllowed")}
              />
            }
            label="반려동물 가능"
          />
        </Box>

        {/* 면적 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 면적"
            type="number"
            value={filter.minNetArea ?? ""}
            onChange={(e) => handleInputChange(e, "minNetArea")}
            fullWidth
          />
          <TextField
            label="최대 면적"
            type="number"
            value={filter.maxNetArea ?? ""}
            onChange={(e) => handleInputChange(e, "maxNetArea")}
            fullWidth
          />
        </Box>

        {/* 가격 범위 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 매매가"
            type="number"
            value={filter.minPrice ?? ""}
            onChange={(e) => handleInputChange(e, "minPrice")}
            fullWidth
          />
          <TextField
            label="최대 매매가"
            type="number"
            value={filter.maxPrice ?? ""}
            onChange={(e) => handleInputChange(e, "maxPrice")}
            fullWidth
          />
        </Box>

        {/* 보증금/월세 범위 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 보증금"
            type="number"
            value={filter.minDeposit ?? ""}
            onChange={(e) => handleInputChange(e, "minDeposit")}
            fullWidth
          />
          <TextField
            label="최대 보증금"
            type="number"
            value={filter.maxDeposit ?? ""}
            onChange={(e) => handleInputChange(e, "maxDeposit")}
            fullWidth
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="최소 월세"
            type="number"
            value={filter.minMonthlyRent ?? ""}
            onChange={(e) => handleInputChange(e, "minMonthlyRent")}
            fullWidth
          />
          <TextField
            label="최대 월세"
            type="number"
            value={filter.maxMonthlyRent ?? ""}
            onChange={(e) => handleInputChange(e, "maxMonthlyRent")}
            fullWidth
          />
        </Box>

        {/* 층수, 주차, 건축연도 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 층수"
            type="number"
            value={filter.minFloor ?? ""}
            onChange={(e) => handleInputChange(e, "minFloor")}
            fullWidth
          />
          <TextField
            label="최대 층수"
            type="number"
            value={filter.maxFloor ?? ""}
            onChange={(e) => handleInputChange(e, "maxFloor")}
            fullWidth
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="최소 주차가능수"
            type="number"
            value={filter.minParkingCapacity ?? ""}
            onChange={(e) => handleInputChange(e, "minParkingCapacity")}
            fullWidth
          />
          <TextField
            label="최대 주차가능수"
            type="number"
            value={filter.maxParkingCapacity ?? ""}
            onChange={(e) => handleInputChange(e, "maxParkingCapacity")}
            fullWidth
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="최소 건축연도"
            type="number"
            value={filter.minConstructionYear ?? ""}
            onChange={(e) => handleInputChange(e, "minConstructionYear")}
            fullWidth
          />
          <TextField
            label="최대 건축연도"
            type="number"
            value={filter.maxConstructionYear ?? ""}
            onChange={(e) => handleInputChange(e, "maxConstructionYear")}
            fullWidth
          />
        </Box>

        {/* 경고 메시지 표시 */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onReset}>초기화</Button>
        <Button onClick={handleApply} variant="contained">
          적용하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyFilterModal;
