import {
  Box,
  Button,
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

interface PublicPropertyFilterModalViewProps {
  open: boolean;
  onClose: () => void;
  localFilters: PublicPropertySearchParams;
  region: RegionState;
  onSidoChange: (event: SelectChangeEvent<string>) => void;
  onGuChange: (event: SelectChangeEvent<string>) => void;
  onDongChange: (event: SelectChangeEvent<string>) => void;
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
      <DialogTitle>상세 필터</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          {/* Location Search Section */}
          <RegionFilterSection
            region={region}
            onSidoChange={onSidoChange}
            onGuChange={onGuChange}
            onDongChange={onDongChange}
          />

          {/* Property Type and Building Info */}
          <PropertyTypeFilterSection
            category={localFilters.category || ""}
            buildingType={localFilters.buildingType || ""}
            buildingName={localFilters.buildingName || ""}
            onCategoryChange={onCategoryChange}
            onBuildingTypeChange={onBuildingTypeChange}
            onBuildingNameChange={onBuildingNameChange}
          />

          <Divider sx={{ my: 3 }} />

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
        <Button onClick={onReset}>초기화</Button>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onApply} variant="contained">
          적용
        </Button>
      </DialogActions>
    </Dialog>
  );
}
