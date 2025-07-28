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
    <div className="inline-block max-w-fit">
      <h6 className="text-base font-medium mb-2">지역</h6>
      <div className="flex gap-4 flex-col lg:flex-row max-w-fit">
        <RegionSelector
          value={region.selectedSido || ""}
          regions={region.sido}
          onChange={onSidoChange}
          label="시/도"
        />

        <RegionSelector
          value={region.selectedSigungu || ""}
          regions={region.sigungu}
          onChange={onGuChange}
          disabled={!region.selectedSido}
          label="구/군"
        />

        <RegionSelector
          value={region.selectedDong || ""}
          regions={region.dong}
          onChange={onDongChange}
          disabled={!region.selectedSigungu}
          label="동"
        />
      </div>
    </div>
  );
}
