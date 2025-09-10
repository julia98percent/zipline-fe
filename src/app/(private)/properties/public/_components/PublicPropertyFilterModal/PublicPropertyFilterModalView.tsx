import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent,
} from "@mui/material";
import { RegionState } from "@/types/region";
import RegionFilterSection from "./components/RegionFilterSection";
import PropertyTypeFilterSection from "./components/PropertyTypeFilterSection";
import PriceRangeSection from "./components/PriceRangeSection";
import AreaRangeSection from "./components/AreaRangeSection";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

interface PublicPropertyFilterModalViewProps {
  open: boolean;
  onClose: () => void;
  netAreaRange: number[];
  totalAreaRange: number[];
  priceRange: number[];
  depositRange: number[];
  rentRange: number[];
  selectedType: string;
  buildingType: string;
  buildingName: string;
  region: RegionState;
  handlePriceRangeChange: (newValue: number | number[]) => void;
  handleDepositRangeChange: (newValue: number | number[]) => void;
  handleRentRangeChange: (newValue: number | number[]) => void;
  handleNetAreaRangeChange: (newValue: number | number[]) => void;
  handleTotalAreaRangeChange: (newValue: number | number[]) => void;
  onSidoChange: (event: SelectChangeEvent<number>) => void;
  onGuChange: (event: SelectChangeEvent<number>) => void;
  onDongChange: (event: SelectChangeEvent<number>) => void;
  onCategoryChange: React.MouseEventHandler<HTMLButtonElement>;
  onBuildingTypeChange: (event: SelectChangeEvent<string>) => void;
  onBuildingNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTemporaryClear: () => void;
  onApply: () => void;
}

export default function PublicPropertyFilterModalView({
  open,
  onClose,
  region,
  netAreaRange,
  totalAreaRange,
  priceRange,
  depositRange,
  rentRange,
  handlePriceRangeChange,
  handleDepositRangeChange,
  handleRentRangeChange,
  handleNetAreaRangeChange,
  handleTotalAreaRangeChange,
  selectedType,
  buildingType,
  buildingName,
  onSidoChange,
  onGuChange,
  onDongChange,
  onCategoryChange,
  onBuildingTypeChange,
  onBuildingNameChange,
  onTemporaryClear,
  onApply,
}: PublicPropertyFilterModalViewProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        className: "w-[90vw] h-175 max-h-[90vh] rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        공개 매물 필터
      </DialogTitle>
      <DialogContent className="bg-neutral-100 flex flex-col gap-3 p-5">
        <div className="p-5 card">
          <TextField
            value={buildingName || ""}
            onChange={onBuildingNameChange}
            label="건물명"
            fullWidth
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="p-5 card">
            <RegionFilterSection
              region={region}
              onSidoChange={onSidoChange}
              onGuChange={onGuChange}
              onDongChange={onDongChange}
            />
          </div>
          <div className="p-5 card">
            <PropertyTypeFilterSection
              category={selectedType || ""}
              buildingType={buildingType || ""}
              onCategoryChange={onCategoryChange}
              onBuildingTypeChange={onBuildingTypeChange}
            />
          </div>
        </div>
        <div className="p-5 card">
          <PriceRangeSection
            category={selectedType || ""}
            priceRange={priceRange}
            depositRange={depositRange}
            rentRange={rentRange}
            handlePriceRangeChange={handlePriceRangeChange}
            handleDepositRangeChange={handleDepositRangeChange}
            handleRentRangeChange={handleRentRangeChange}
          />
        </div>
        <div className="p-5 card">
          <AreaRangeSection
            netAreaRange={netAreaRange}
            totalAreaRange={totalAreaRange}
            handleNetAreaRangeChange={handleNetAreaRangeChange}
            handleTotalAreaRangeChange={handleTotalAreaRangeChange}
          />
        </div>
      </DialogContent>
      <DialogActions className="flex items-center justify-end p-6 border-t border-gray-200">
        <Button variant="text" color="info" onClick={onTemporaryClear}>
          입력 값 초기화
        </Button>
        <Button variant="outlined" color="info" onClick={onClose}>
          취소
        </Button>
        <Button onClick={onApply} variant="contained">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
}
