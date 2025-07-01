import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
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
  minTotalArea: number;
  maxTotalArea: number;
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

const formatNumber = (value: string | number) =>
  value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parseNumber = (value: string) =>
  value.replace(/,/g, "").replace(/[^\d]/g, "");

const PropertyFilterModal = ({
  open,
  onClose,
  filter,
  setFilter,
  onApply,
  onReset,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  // 가격 입력용 상태
  const [priceInputs, setPriceInputs] = useState({
    minPrice: filter.minPrice !== undefined ? formatNumber(filter.minPrice) : "",
    maxPrice: filter.maxPrice !== undefined ? formatNumber(filter.maxPrice) : "",
    minDeposit: filter.minDeposit !== undefined ? formatNumber(filter.minDeposit) : "",
    maxDeposit: filter.maxDeposit !== undefined ? formatNumber(filter.maxDeposit) : "",
    minMonthlyRent: filter.minMonthlyRent !== undefined ? formatNumber(filter.minMonthlyRent) : "",
    maxMonthlyRent: filter.maxMonthlyRent !== undefined ? formatNumber(filter.maxMonthlyRent) : "",
  });

  useEffect(() => {
    setPriceInputs({
      minPrice: filter.minPrice !== undefined ? formatNumber(filter.minPrice) : "",
      maxPrice: filter.maxPrice !== undefined ? formatNumber(filter.maxPrice) : "",
      minDeposit: filter.minDeposit !== undefined ? formatNumber(filter.minDeposit) : "",
      maxDeposit: filter.maxDeposit !== undefined ? formatNumber(filter.maxDeposit) : "",
      minMonthlyRent: filter.minMonthlyRent !== undefined ? formatNumber(filter.minMonthlyRent) : "",
      maxMonthlyRent: filter.maxMonthlyRent !== undefined ? formatNumber(filter.maxMonthlyRent) : "",
    });
  }, [filter]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FilterRequest
  ) => {
    const raw = e.target.value;
    const isPriceField = [
      "minPrice",
      "maxPrice",
      "minDeposit",
      "maxDeposit",
      "minMonthlyRent",
      "maxMonthlyRent",
    ].includes(field);

    // 면적, 주차 필드는 소숫점 허용
    const isDoubleField = [
      "minNetArea",
      "maxNetArea",
      "minTotalArea",
      "maxTotalArea",
      "minParkingCapacity",
      "maxParkingCapacity",
    ].includes(field);

    if (isPriceField) {
      const numericValue = parseNumber(raw);
      setPriceInputs((prev) => ({ ...prev, [field]: formatNumber(numericValue) }));
      if (numericValue === "") {
        setFilter({ ...filter, [field]: undefined });
      } else {
        setFilter({ ...filter, [field]: Number(numericValue) });
      }
    } else if (isDoubleField) {
      // 소숫점 허용
      const value = raw === "" ? undefined : Number(raw);
      if (value !== undefined && isNaN(value)) return;
      setFilter({ ...filter, [field]: value });
    } else {
      const value = Number(raw);
      if (value < 0) return; // 음수 입력 방지
      setFilter({ ...filter, [field]: value });
    }
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
      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
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
            label="최소 전용 면적"
            type="number"
            inputProps={{ step: 'any' }}
            value={filter.minNetArea ?? ""}
            onChange={(e) => handleInputChange(e, "minNetArea")}
            fullWidth
          />
          <TextField
            label="최대 전용 면적"
            type="number"
            inputProps={{ step: 'any' }}
            value={filter.maxNetArea ?? ""}
            onChange={(e) => handleInputChange(e, "maxNetArea")}
            fullWidth
          />
        </Box>

        {/* 공급면적 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 공급 면적"
            type="number"
            inputProps={{ step: 'any' }}
            value={filter.minTotalArea ?? ""}
            onChange={(e) => handleInputChange(e, "minTotalArea")}
            fullWidth
          />
          <TextField
            label="최대 공급 면적"
            type="number"
            inputProps={{ step: 'any' }}
            value={filter.maxTotalArea ?? ""}
            onChange={(e) => handleInputChange(e, "maxTotalArea")}
            fullWidth
          />
        </Box>

        {/* 가격 범위 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 매매가"
            type="text"
            value={priceInputs.minPrice}
            onChange={(e) => handleInputChange(e, "minPrice")}
            fullWidth
          />
          <TextField
            label="최대 매매가"
            type="text"
            value={priceInputs.maxPrice}
            onChange={(e) => handleInputChange(e, "maxPrice")}
            fullWidth
          />
        </Box>

        {/* 보증금/월세 범위 */}
        <Box display="flex" gap={2}>
          <TextField
            label="최소 보증금"
            type="text"
            value={priceInputs.minDeposit}
            onChange={(e) => handleInputChange(e, "minDeposit")}
            fullWidth
          />
          <TextField
            label="최대 보증금"
            type="text"
            value={priceInputs.maxDeposit}
            onChange={(e) => handleInputChange(e, "maxDeposit")}
            fullWidth
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="최소 월세"
            type="text"
            value={priceInputs.minMonthlyRent}
            onChange={(e) => handleInputChange(e, "minMonthlyRent")}
            fullWidth
          />
          <TextField
            label="최대 월세"
            type="text"
            value={priceInputs.maxMonthlyRent}
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
            inputProps={{ step: 'any' }}
            value={filter.minParkingCapacity ?? ""}
            onChange={(e) => handleInputChange(e, "minParkingCapacity")}
            fullWidth
          />
          <TextField
            label="최대 주차가능수"
            type="number"
            inputProps={{ step: 'any' }}
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
