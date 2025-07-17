import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material";
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
  const [hasElevator, setHasElevator] = useState<string>(
    filters.hasElevator === true
      ? "true"
      : filters.hasElevator === false
      ? "false"
      : "all"
  );
  const [petsAllowed, setPetsAllowed] = useState<string>(
    filters.petsAllowed === true
      ? "true"
      : filters.petsAllowed === false
      ? "false"
      : "all"
  );

  // 면적 범위 (전용 면적)
  const [netAreaRange, setNetAreaRange] = useState<number[]>([
    filters.minNetArea || 0,
    filters.maxNetArea || 200,
  ]);

  // 면적 범위 (공급 면적)
  const [totalAreaRange, setTotalAreaRange] = useState<number[]>([
    filters.minTotalArea || 0,
    filters.maxTotalArea || 300,
  ]);

  // 가격 범위 (매매가)
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || 0,
    filters.maxPrice || 100000,
  ]);

  // 가격 범위 (보증금)
  const [depositRange, setDepositRange] = useState<number[]>([
    filters.minDeposit || 0,
    filters.maxDeposit || 50000,
  ]);

  // filters prop이 변경될 때마다 상태 업데이트
  useEffect(() => {
    setHasElevator(
      filters.hasElevator === true
        ? "true"
        : filters.hasElevator === false
        ? "false"
        : "all"
    );
    setPetsAllowed(
      filters.petsAllowed === true
        ? "true"
        : filters.petsAllowed === false
        ? "false"
        : "all"
    );
    setNetAreaRange([filters.minNetArea || 0, filters.maxNetArea || 200]);
    setTotalAreaRange([filters.minTotalArea || 0, filters.maxTotalArea || 300]);
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 100000]);
    setDepositRange([filters.minDeposit || 0, filters.maxDeposit || 50000]);
  }, [filters]);

  const handleApply = () => {
    const cleanedFilters: Partial<AgentPropertySearchParams> = {};

    // Boolean 필터들
    if (hasElevator === "true") {
      cleanedFilters.hasElevator = true;
    } else if (hasElevator === "false") {
      cleanedFilters.hasElevator = false;
    } else {
      cleanedFilters.hasElevator = undefined;
    }

    if (petsAllowed === "true") {
      cleanedFilters.petsAllowed = true;
    } else if (petsAllowed === "false") {
      cleanedFilters.petsAllowed = false;
    } else {
      cleanedFilters.petsAllowed = undefined;
    }

    if (netAreaRange[0] > 0 || netAreaRange[1] < 200) {
      cleanedFilters.minNetArea = netAreaRange[0];
      cleanedFilters.maxNetArea = netAreaRange[1];
    } else {
      cleanedFilters.minNetArea = undefined;
      cleanedFilters.maxNetArea = undefined;
    }

    if (totalAreaRange[0] > 0 || totalAreaRange[1] < 300) {
      cleanedFilters.minTotalArea = totalAreaRange[0];
      cleanedFilters.maxTotalArea = totalAreaRange[1];
    } else {
      cleanedFilters.minTotalArea = undefined;
      cleanedFilters.maxTotalArea = undefined;
    }

    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      cleanedFilters.minPrice = priceRange[0];
      cleanedFilters.maxPrice = priceRange[1];
    } else {
      cleanedFilters.minPrice = undefined;
      cleanedFilters.maxPrice = undefined;
    }

    if (depositRange[0] > 0 || depositRange[1] < 50000) {
      cleanedFilters.minDeposit = depositRange[0];
      cleanedFilters.maxDeposit = depositRange[1];
    } else {
      cleanedFilters.minDeposit = undefined;
      cleanedFilters.maxDeposit = undefined;
    }

    onApply(cleanedFilters);
    onClose();
  };

  const handleReset = () => {
    setHasElevator("all");
    setPetsAllowed("all");
    setNetAreaRange([0, 200]);
    setTotalAreaRange([0, 300]);
    setPriceRange([0, 100000]);
    setDepositRange([0, 50000]);
  };

  const formatPrice = (value: number, isMaxValue?: boolean) => {
    let formatted = "";
    if (value >= 10000) {
      formatted = `${(value / 10000).toFixed(0)}억원`;
    } else if (value >= 1000) {
      formatted = `${(value / 1000).toFixed(0)}천만원`;
    } else {
      formatted = `${value}만원`;
    }

    if (isMaxValue) {
      formatted += "~";
    }

    return formatted;
  };

  const formatPriceForSlider = (value: number, max?: number) => {
    let formatted = "";
    if (value >= 10000) {
      formatted = `${(value / 10000).toFixed(0)}억원`;
    } else if (value >= 1000) {
      formatted = `${(value / 1000).toFixed(0)}천만원`;
    } else {
      formatted = `${value}만원`;
    }

    if (max && value === max) {
      formatted += "~";
    }

    return formatted;
  };

  const getPriceStep = (value: number) => {
    if (value <= 1000) return 100; // 1천만원까지는 100만원 단위
    if (value <= 5000) return 500; // 5천만원까지는 500만원 단위
    if (value <= 10000) return 1000; // 1억까지는 1천만원 단위
    return 5000; // 1억 이후는 5천만원 단위
  };

  const handlePriceRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep(min);
    const maxStep = getPriceStep(max);

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setPriceRange([adjustedMin, adjustedMax]);
  };

  const handleDepositRangeChange = (newValue: number | number[]) => {
    const range = Array.isArray(newValue) ? newValue : [newValue, newValue];
    const [min, max] = range;
    const minStep = getPriceStep(min);
    const maxStep = getPriceStep(max);

    const adjustedMin = Math.round(min / minStep) * minStep;
    const adjustedMax = Math.round(max / maxStep) * maxStep;

    setDepositRange([adjustedMin, adjustedMax]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          상세 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 5, py: 2 }}>
        {/* 건물 특성 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            건물 특성
          </Typography>

          {/* 엘리베이터 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              엘리베이터
            </Typography>
            <RadioGroup
              value={hasElevator}
              onChange={(e) => setHasElevator(e.target.value)}
              row
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="전체"
                sx={{ mr: 3 }}
              />
              <FormControlLabel
                value="true"
                control={<Radio size="small" />}
                label="있음"
                sx={{ mr: 3 }}
              />
              <FormControlLabel
                value="false"
                control={<Radio size="small" />}
                label="없음"
              />
            </RadioGroup>
          </Box>

          {/* 반려동물 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              반려동물
            </Typography>
            <RadioGroup
              value={petsAllowed}
              onChange={(e) => setPetsAllowed(e.target.value)}
              row
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="전체"
                sx={{ mr: 3 }}
              />
              <FormControlLabel
                value="true"
                control={<Radio size="small" />}
                label="허용"
                sx={{ mr: 3 }}
              />
              <FormControlLabel
                value="false"
                control={<Radio size="small" />}
                label="불허용"
              />
            </RadioGroup>
          </Box>
        </Box>

        {/* 면적 범위 */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              면적 범위
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setNetAreaRange([0, 200]);
                setTotalAreaRange([0, 300]);
              }}
              sx={{ color: "primary.main", p: 0 }}
            >
              초기화
            </Button>
          </Box>

          {/* 전용 면적 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              전용 면적: {netAreaRange[0]}m² -{" "}
              {netAreaRange[1] === 200
                ? `${netAreaRange[1]}m²~`
                : `${netAreaRange[1]}m²`}
            </Typography>
            <Slider
              value={netAreaRange}
              onChange={(_, newValue) => setNetAreaRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              step={5}
              valueLabelFormat={(value) =>
                value === 200 ? `${value}m²~` : `${value}m²`
              }
              sx={{
                color: "primary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "primary.main",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                  "&:focus": {
                    boxShadow: "none",
                  },
                  "&.Mui-active": {
                    boxShadow: "none",
                  },
                },
                "& .MuiSlider-track": {
                  backgroundColor: "primary.main",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "grey.300",
                },
              }}
            />
          </Box>

          {/* 공급 면적 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              공급 면적: {totalAreaRange[0]}m² -{" "}
              {totalAreaRange[1] === 300
                ? `${totalAreaRange[1]}m²~`
                : `${totalAreaRange[1]}m²`}
            </Typography>
            <Slider
              value={totalAreaRange}
              onChange={(_, newValue) =>
                setTotalAreaRange(newValue as number[])
              }
              valueLabelDisplay="auto"
              min={0}
              max={300}
              step={5}
              valueLabelFormat={(value) =>
                value === 300 ? `${value}m²~` : `${value}m²`
              }
              sx={{
                color: "primary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "primary.main",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                  "&:focus": {
                    boxShadow: "none",
                  },
                  "&.Mui-active": {
                    boxShadow: "none",
                  },
                },
                "& .MuiSlider-track": {
                  backgroundColor: "primary.main",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "grey.300",
                },
              }}
            />
          </Box>
        </Box>

        {/* 가격 범위 */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              가격 범위 (만원)
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setPriceRange([0, 100000]);
                setDepositRange([0, 50000]);
              }}
              sx={{ color: "primary.main", p: 0 }}
            >
              초기화
            </Button>
          </Box>

          {/* 매매가 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              매매가: {formatPrice(priceRange[0])} -{" "}
              {formatPrice(priceRange[1], priceRange[1] === 100000)}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => handlePriceRangeChange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={100}
              valueLabelFormat={(value) => formatPriceForSlider(value, 100000)}
              sx={{
                color: "primary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "primary.main",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                  "&:focus": {
                    boxShadow: "none",
                  },
                  "&.Mui-active": {
                    boxShadow: "none",
                  },
                },
                "& .MuiSlider-track": {
                  backgroundColor: "primary.main",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "grey.300",
                },
              }}
            />
          </Box>

          {/* 보증금 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              보증금: {formatPrice(depositRange[0])} -{" "}
              {formatPrice(depositRange[1], depositRange[1] === 50000)}
            </Typography>
            <Slider
              value={depositRange}
              onChange={(_, newValue) => handleDepositRangeChange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={50000}
              step={100}
              valueLabelFormat={(value) => formatPriceForSlider(value, 50000)}
              sx={{
                color: "primary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "primary.main",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                  "&:focus": {
                    boxShadow: "none",
                  },
                  "&.Mui-active": {
                    boxShadow: "none",
                  },
                },
                "& .MuiSlider-track": {
                  backgroundColor: "primary.main",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "grey.300",
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            borderColor: "grey.300",
            color: "text.primary",
          }}
        >
          전체 필터 초기화
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentPropertyFilterModal;
