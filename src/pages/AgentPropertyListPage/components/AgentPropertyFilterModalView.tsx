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
  const sliderStyles = {
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
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-xl max-h-4/5",
      }}
    >
      <DialogTitle className="flex justify-between items-center pb-2">
        <Typography className="text-xl font-bold text-primary">
          상세 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="px-10 py-4">
        {/* 건물 특성 */}
        <Box className="mb-8">
          <Typography variant="subtitle1" className="font-semibold mb-4">
            건물 특성
          </Typography>

          {/* 엘리베이터 */}
          <Box className="mb-6">
            <Typography variant="body2" className="mb-2 text-gray-600">
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
                className="mr-6"
              />
              <FormControlLabel
                value="true"
                control={<Radio size="small" />}
                label="있음"
                className="mr-6"
              />
              <FormControlLabel
                value="false"
                control={<Radio size="small" />}
                label="없음"
              />
            </RadioGroup>
          </Box>

          {/* 반려동물 */}
          <Box className="mb-6">
            <Typography variant="body2" className="mb-2 text-gray-600">
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
                className="mr-6"
              />
              <FormControlLabel
                value="true"
                control={<Radio size="small" />}
                label="허용"
                className="mr-6"
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
        <Box className="mb-8">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="subtitle1" className="font-semibold">
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
          <Box className="mb-6">
            <Typography variant="body2" className="mb-2 text-gray-600">
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
              sx={sliderStyles}
            />
          </Box>

          {/* 공급 면적 */}
          <Box className="mb-6">
            <Typography variant="body2" className="mb-2 text-gray-600">
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
              sx={sliderStyles}
            />
          </Box>
        </Box>

        {/* 가격 범위 */}
        <Box>
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="subtitle1" className="font-semibold">
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
          <Box className="mb-6">
            <Typography variant="body2" className="mb-2 text-gray-600">
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
              sx={sliderStyles}
            />
          </Box>

          {/* 보증금 */}
          <Box className="mb-6">
            <Typography variant="body2" className="mb-2 text-gray-600">
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
              sx={sliderStyles}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 pt-2 gap-4">
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
