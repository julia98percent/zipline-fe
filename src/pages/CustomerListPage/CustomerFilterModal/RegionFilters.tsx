import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { RegionState } from "@ts/region";

interface Region {
  cortarNo: number;
  cortarName: string;
}

interface Props {
  region: RegionState;
  setRegion: (region: RegionState | ((prev: RegionState) => RegionState)) => void;
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
    (type: "sido" | "sigungu" | "dong") => (event: any) => {
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
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        지역
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        {["sido", "sigungu", "dong"].map((type) => (
          <FormControl key={type} fullWidth>
            <InputLabel>
              {{ sido: "시/도", sigungu: "시/군/구", dong: "동/읍/면" }[type]}
            </InputLabel>
            <Select
              value={
                region[
                  `selected${
                    type.charAt(0).toUpperCase() + type.slice(1)
                  }` as keyof typeof region
                ] || ""
              }
              onChange={handleRegionChange(type as "sido" | "sigungu" | "dong")}
              label={
                { sido: "시/도", sigungu: "시/군/구", dong: "동/읍/면" }[type]
              }
            >
              <MenuItem value="">전체</MenuItem>
              {region[type as keyof typeof region] &&
                Array.isArray(region[type as keyof typeof region]) &&
                (region[type as keyof typeof region] as Region[]).map(
                  (item: Region) => (
                    <MenuItem key={item.cortarNo} value={item.cortarNo}>
                      {item.cortarName}
                    </MenuItem>
                  )
                )}
            </Select>
          </FormControl>
        ))}
      </Box>
    </Box>
  );
};

export default RegionFilters;
