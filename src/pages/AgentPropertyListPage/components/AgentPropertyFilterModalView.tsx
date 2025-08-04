import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

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
      maxWidth={false}
      PaperProps={{
        className: "w-200 h-175 max-h-[90vh] bg-white rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        개인 매물 필터
      </DialogTitle>

      <DialogContent className="flex flex-col gap-6 mx-4 p-7">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h6 className="font-semibold">엘리베이터 여부</h6>
            <RadioGroup
              value={hasElevator}
              onChange={(e) => setHasElevator(e.target.value)}
              row
              className="gap-4"
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="전체"
              />
              <FormControlLabel
                value="true"
                control={<Radio size="small" />}
                label="있음"
              />
              <FormControlLabel
                value="false"
                control={<Radio size="small" />}
                label="없음"
              />
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <h6 className="font-semibold">반려동물 가능 여부</h6>
            <RadioGroup
              value={petsAllowed}
              onChange={(e) => setPetsAllowed(e.target.value)}
              row
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="전체"
              />
              <FormControlLabel
                value="true"
                control={<Radio size="small" />}
                label="가능"
              />
              <FormControlLabel
                value="false"
                control={<Radio size="small" />}
                label="불가능"
              />
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center">
            <h6 className="font-semibold">면적 범위</h6>
            <Button
              variant="text"
              onClick={() => {
                setNetAreaRange([0, 200]);
                setTotalAreaRange([0, 300]);
              }}
              className="p-0!"
            >
              초기화
            </Button>
          </div>

          <div className="mx-4">
            <p className="text-sm mb-2 text-gray-600">
              전용 면적: {netAreaRange[0]}m² -{" "}
              {netAreaRange[1] === 200
                ? `${netAreaRange[1]}m²~`
                : `${netAreaRange[1]}m²`}
            </p>
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
            />

            <p className="text-sm mb-2 text-gray-600">
              공급 면적: {totalAreaRange[0]}m² -{" "}
              {totalAreaRange[1] === 300
                ? `${totalAreaRange[1]}m²~`
                : `${totalAreaRange[1]}m²`}
            </p>
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
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h6 className="font-semibold">가격 범위</h6>
            <Button
              variant="text"
              onClick={() => {
                handlePriceRangeChange([0, 100000]);
                handleDepositRangeChange([0, 50000]);
              }}
              className="p-0!"
            >
              초기화
            </Button>
          </div>

          {/* 매매가 */}
          <div className="mx-4">
            <p className="text-sm mb-2 text-gray-600">
              매매가: {formatPrice(priceRange[0])} -{" "}
              {formatPrice(priceRange[1], priceRange[1] === 100000)}
            </p>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => handlePriceRangeChange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={100}
              valueLabelFormat={(value) => formatPriceForSlider(value, 100000)}
            />
          </div>

          <div className="mx-4">
            <p className="text-sm mb-2 text-gray-600">
              보증금: {formatPrice(depositRange[0])} -{" "}
              {formatPrice(depositRange[1], depositRange[1] === 50000)}
            </p>
            <Slider
              value={depositRange}
              onChange={(_, newValue) => handleDepositRangeChange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={50000}
              step={100}
              valueLabelFormat={(value) => formatPriceForSlider(value, 50000)}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <Button onClick={onReset} variant="outlined" color="info">
            입력 값 초기화
          </Button>
          <Button onClick={onClose} variant="outlined">
            취소
          </Button>
          <Button onClick={onApply}>적용</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AgentPropertyFilterModalView;
