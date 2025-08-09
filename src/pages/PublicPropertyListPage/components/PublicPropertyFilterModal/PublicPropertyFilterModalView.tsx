import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent,
} from "@mui/material";
import { RegionState } from "@ts/region";
import { PublicPropertySearchParams } from "@ts/property";
import RegionFilterSection from "./components/RegionFilterSection";
import PropertyTypeFilterSection from "./components/PropertyTypeFilterSection";
import PriceRangeSection from "./components/PriceRangeSection";
import AreaRangeSection from "./components/AreaRangeSection";
import Button from "@components/Button";
import TextField from "@components/TextField";

interface PublicPropertyFilterModalViewProps {
  open: boolean;
  onClose: () => void;
  localFilters: PublicPropertySearchParams;
  region: RegionState;
  onSidoChange: (event: SelectChangeEvent<number>) => void;
  onGuChange: (event: SelectChangeEvent<number>) => void;
  onDongChange: (event: SelectChangeEvent<number>) => void;
  onSliderChange: (
    field: string
  ) => (_: Event, newValue: number | number[]) => void;
  onCategoryChange: (event: SelectChangeEvent<string>) => void;
  onBuildingTypeChange: (event: SelectChangeEvent<string>) => void;
  onBuildingNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTemporaryClear: () => void;
  onApply: () => void;
}

export default function PublicPropertyFilterModalView({
  open,
  onClose,
  localFilters,
  region,
  onSidoChange,
  onGuChange,
  onDongChange,
  onSliderChange,
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
        className: "w-200 h-175 max-h-[90vh] bg-white rounded-lg",
      }}
    >
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        공개 매물 필터
      </DialogTitle>
      <DialogContent className="flex flex-col gap-6 mx-4 p-8">
        <TextField
          value={localFilters.buildingName || ""}
          onChange={onBuildingNameChange}
          label="건물명"
          fullWidth
        />

        <div className="flex flex-col gap-8">
          <RegionFilterSection
            region={region}
            onSidoChange={onSidoChange}
            onGuChange={onGuChange}
            onDongChange={onDongChange}
          />

          <PropertyTypeFilterSection
            category={localFilters.category || ""}
            buildingType={localFilters.buildingType || ""}
            onCategoryChange={onCategoryChange}
            onBuildingTypeChange={onBuildingTypeChange}
          />
        </div>

        <PriceRangeSection
          category={localFilters.category || ""}
          minPrice={localFilters.minPrice}
          maxPrice={localFilters.maxPrice}
          minDeposit={localFilters.minDeposit}
          maxDeposit={localFilters.maxDeposit}
          minMonthlyRent={localFilters.minMonthlyRent}
          maxMonthlyRent={localFilters.maxMonthlyRent}
          onSliderChange={onSliderChange}
        />

        {/* Area Ranges */}
        <AreaRangeSection
          minNetArea={localFilters.minNetArea}
          maxNetArea={localFilters.maxNetArea}
          minTotalArea={localFilters.minTotalArea}
          maxTotalArea={localFilters.maxTotalArea}
          onSliderChange={onSliderChange}
        />
      </DialogContent>
      <DialogActions className="flex items-center justify-end p-6 border-t border-gray-200">
        <Button variant="text" color="info" onClick={onTemporaryClear}>
          입력 값 초기화
        </Button>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
        <Button onClick={onApply} variant="contained">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
}
