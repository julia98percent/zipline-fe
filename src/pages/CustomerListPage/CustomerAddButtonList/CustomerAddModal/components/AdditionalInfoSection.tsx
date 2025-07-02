import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import TextField from "@components/TextField";
import { Region } from "@ts/region";

interface AdditionalInfoSectionProps {
  regionState: {
    sido: Region[];
    sigungu: Region[];
    dong: Region[];
    selectedSido: number | null;
    selectedSigungu: number | null;
    selectedDong: number | null;
  };
  trafficSource: string;
  onRegionChange: (
    type: "sido" | "sigungu" | "dong"
  ) => (event: SelectChangeEvent) => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AdditionalInfoSection({
  regionState,
  trafficSource,
  onRegionChange,
  onFieldChange,
}: AdditionalInfoSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        부가 정보
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          관심 지역
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {(["sido", "sigungu", "dong"] as const).map((type) => {
            const selectedKey = `selected${
              type.charAt(0).toUpperCase() + type.slice(1)
            }` as keyof typeof regionState;
            return (
              <FormControl fullWidth key={type} size="small">
                <InputLabel>
                  {type === "sido"
                    ? "시/도"
                    : type === "sigungu"
                    ? "시/군/구"
                    : "읍/면/동"}
                </InputLabel>
                <Select
                  value={String(regionState[selectedKey] || "")}
                  onChange={onRegionChange(type)}
                  label={
                    type === "sido"
                      ? "시/도"
                      : type === "sigungu"
                      ? "시/군/구"
                      : "읍/면/동"
                  }
                  disabled={
                    type !== "sido" &&
                    !regionState[
                      type === "dong" ? "selectedSigungu" : "selectedSido"
                    ]
                  }
                >
                  {regionState[type].map((item: Region) => (
                    <MenuItem key={item.cortarNo} value={String(item.cortarNo)}>
                      {item.cortarName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          유입경로
        </Typography>
        <TextField
          name="trafficSource"
          value={trafficSource}
          onChange={onFieldChange}
          fullWidth
          placeholder="유입경로를 입력하세요"
          size="small"
        />
      </Box>
    </Box>
  );
}
