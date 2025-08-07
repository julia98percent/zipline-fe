import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  onReset: () => void;
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
  onReset,
  onApply,
}: PublicPropertyFilterModalViewProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-xl font-bold text-primary">
        상세 필터
      </DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-4">
          <div className="flex gap-8">
            <div className="border-r border-gray-300 pr-8">
              <RegionFilterSection
                region={region}
                onSidoChange={onSidoChange}
                onGuChange={onGuChange}
                onDongChange={onDongChange}
              />
            </div>
            <PropertyTypeFilterSection
              category={localFilters.category || ""}
              buildingType={localFilters.buildingType || ""}
              onCategoryChange={onCategoryChange}
              onBuildingTypeChange={onBuildingTypeChange}
            />
          </div>
          <TextField
            value={localFilters.buildingName || ""}
            onChange={onBuildingNameChange}
            label="건물명"
            fullWidth
          />

          {/* Property Type and Building Info */}

          <Divider className="my-6" />

          {/* Price Ranges */}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="info" onClick={onReset}>
          초기화
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
