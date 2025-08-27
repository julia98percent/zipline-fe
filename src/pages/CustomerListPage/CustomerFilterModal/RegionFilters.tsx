import { SelectChangeEvent } from "@mui/material";
import RegionSelector from "@components/RegionSelector";
import { RegionState } from "@ts/region";

interface Props {
  region: RegionState;
  setRegion: (
    region: RegionState | ((prev: RegionState) => RegionState)
  ) => void;
  onSidoChange?: (sidoCortarNo: number) => void;
  onSigunguChange?: (sigunguCortarNo: number) => void;
}

const RegionFilters = ({
  region,
  setRegion,
  onSidoChange,
  onSigunguChange,
}: Props) => {
  const handleRegionChange =
    (type: "sido" | "sigungu" | "dong") =>
    (event: SelectChangeEvent<number>) => {
      const value = Number(event.target.value) || null;
      const updateKey = `selected${
        type.charAt(0).toUpperCase() + type.slice(1)
      }` as keyof RegionState;

      setRegion((prev) => ({
        ...prev,
        [updateKey]: value,
      }));

      // 상위 지역 선택 시 하위 지역 데이터 로드
      if (type === "sido" && value && onSidoChange) {
        onSidoChange(value);
      } else if (type === "sigungu" && value && onSigunguChange) {
        onSigunguChange(value);
      }
    };

  return (
    <div className="p-5 card">
      <h5 className="text-lg font-bold mb-4">지역</h5>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RegionSelector
          label="시/도"
          value={region.selectedSido || ""}
          regions={region.sido || []}
          onChange={handleRegionChange("sido")}
          size="medium"
        />
        <RegionSelector
          label="시/군/구"
          value={region.selectedSigungu || ""}
          regions={region.sigungu || []}
          onChange={handleRegionChange("sigungu")}
          disabled={!region.selectedSido}
          size="medium"
        />
        <RegionSelector
          label="동/읍/면"
          value={region.selectedDong || ""}
          regions={region.dong || []}
          onChange={handleRegionChange("dong")}
          disabled={!region.selectedSigungu}
          size="medium"
        />
      </div>
    </div>
  );
};

export default RegionFilters;
