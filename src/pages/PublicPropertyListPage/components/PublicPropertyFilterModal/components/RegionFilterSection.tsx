import { SelectChangeEvent } from "@mui/material";
import RegionSelector from "@components/RegionSelector";
import { RegionState } from "@ts/region";

interface RegionFilterSectionProps {
  region: RegionState;
  onSidoChange: (event: SelectChangeEvent<number>) => void;
  onGuChange: (event: SelectChangeEvent<number>) => void;
  onDongChange: (event: SelectChangeEvent<number>) => void;
}

export default function RegionFilterSection({
  region,
  onSidoChange,
  onGuChange,
  onDongChange,
}: RegionFilterSectionProps) {
  return (
    <div>
      <h6 className="font-semibold mb-2">지역</h6>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RegionSelector
          value={region.selectedSido || ""}
          regions={region.sido}
          onChange={onSidoChange}
          label="시/도"
          size="medium"
        />

        <RegionSelector
          value={region.selectedSigungu || ""}
          regions={region.sigungu}
          onChange={onGuChange}
          disabled={!region.selectedSido}
          label="구/군"
          size="medium"
        />

        <RegionSelector
          value={region.selectedDong || ""}
          regions={region.dong}
          onChange={onDongChange}
          disabled={!region.selectedSigungu}
          label="동"
          size="medium"
        />
      </div>
    </div>
  );
}
