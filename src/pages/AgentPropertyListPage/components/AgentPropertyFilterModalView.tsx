import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Slider,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@components/Button";

interface AgentPropertyFilterModalViewProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;

  // 상태 값들
  hasElevator: string;
  petsAllowed: string;
  netAreaRange: number[];
  totalAreaRange: number[];
  priceRange: number[];
  depositRange: number[];

  // 상태 변경 함수들
  setHasElevator: (value: string) => void;
  setPetsAllowed: (value: string) => void;
  setNetAreaRange: (value: number[]) => void;
  setTotalAreaRange: (value: number[]) => void;
  handlePriceRangeChange: (newValue: number | number[]) => void;
  handleDepositRangeChange: (newValue: number | number[]) => void;

  // 유틸리티 함수들
  formatPrice: (value: number, isMaxValue?: boolean) => string;
  formatPriceForSlider: (value: number, max?: number) => string;
}

const AgentPropertyFilterModalView = ({
  open,
  onClose,
  onApply,
  onReset,
  hasElevator,
  petsAllowed,
  netAreaRange,
  totalAreaRange,
  priceRange,
  depositRange,
  setHasElevator,
  setPetsAllowed,
  setNetAreaRange,
  setTotalAreaRange,
  handlePriceRangeChange,
  handleDepositRangeChange,
  formatPrice,
  formatPriceForSlider,
}: AgentPropertyFilterModalViewProps) => {
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
              onClick={() => {
                setNetAreaRange([0, 200]);
                setTotalAreaRange([0, 300]);
              }}
              className="p-0"
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
                color: "secondary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "secondary.main",
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
                  backgroundColor: "secondary.main",
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
                color: "secondary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "secondary.main",
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
                  backgroundColor: "secondary.main",
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
              onClick={() => {
                handlePriceRangeChange([0, 100000]);
                handleDepositRangeChange([0, 50000]);
              }}
              className="p-0"
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
                color: "secondary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "secondary.main",
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
                  backgroundColor: "secondary.main",
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
                color: "secondary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: "secondary.main",
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
                  backgroundColor: "secondary.main",
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
          onClick={onReset}
          variant="outlined"
          color="info"
          className="w-full py-3"
        >
          전체 필터 초기화
        </Button>
        <Button onClick={onApply} className="w-full py-3">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentPropertyFilterModalView;
