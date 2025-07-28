import { Box, Typography, SelectChangeEvent } from "@mui/material";
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
    <Box className="mb-6">
      <Typography variant="h6" className="mb-4 font-semibold">
        지역
      </Typography>
      <Box className="flex gap-4">
        <RegionSelector
          label="시/도"
          value={region.selectedSido || ""}
          regions={region.sido || []}
          onChange={handleRegionChange("sido")}
        />
        <RegionSelector
          label="시/군/구"
          value={region.selectedSigungu || ""}
          regions={region.sigungu || []}
          onChange={handleRegionChange("sigungu")}
          disabled={!region.selectedSido}
        />
        <RegionSelector
          label="동/읍/면"
          value={region.selectedDong || ""}
          regions={region.dong || []}
          onChange={handleRegionChange("dong")}
          disabled={!region.selectedSigungu}
        />
      </Box>
    </Box>
  );
};

export default RegionFilters;
