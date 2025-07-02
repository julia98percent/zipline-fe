import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { RegionState, Region } from "@ts/region";

interface RegionFilterSectionProps {
  region: RegionState;
  onSidoChange: (event: SelectChangeEvent<string>) => void;
  onGuChange: (event: SelectChangeEvent<string>) => void;
  onDongChange: (event: SelectChangeEvent<string>) => void;
}

export default function RegionFilterSection({
  region,
  onSidoChange,
  onGuChange,
  onDongChange,
}: RegionFilterSectionProps) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        지역 검색
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <FormControl sx={{ flex: 1, minWidth: "150px" }}>
          <InputLabel id="sido-label">시/도</InputLabel>
          <Select
            labelId="sido-label"
            value={
              region.sido.find(
                (item: Region) => item.cortarNo === region.selectedSido
              )?.cortarName || ""
            }
            onChange={onSidoChange}
            label="시/도"
          >
            <MenuItem value="">
              <em>선택하세요</em>
            </MenuItem>
            {region.sido.map((item: Region) => (
              <MenuItem key={item.cortarNo} value={item.cortarName}>
                {item.cortarName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1, minWidth: "150px" }}>
          <InputLabel id="gu-label">구/군</InputLabel>
          <Select
            labelId="gu-label"
            value={
              region.sigungu.find(
                (item: Region) => item.cortarNo === region.selectedSigungu
              )?.cortarName || ""
            }
            onChange={onGuChange}
            label="구/군"
          >
            <MenuItem value="">
              <em>선택하세요</em>
            </MenuItem>
            {region.sigungu.map((item: Region) => (
              <MenuItem key={item.cortarNo} value={item.cortarName}>
                {item.cortarName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1, minWidth: "150px" }}>
          <InputLabel id="dong-label">동</InputLabel>
          <Select
            labelId="dong-label"
            value={
              region.dong.find(
                (item: Region) => item.cortarNo === region.selectedDong
              )?.cortarName || ""
            }
            onChange={onDongChange}
            label="동"
          >
            <MenuItem value="">
              <em>선택하세요</em>
            </MenuItem>
            {region.dong.map((item: Region) => (
              <MenuItem key={item.cortarNo} value={item.cortarName}>
                {item.cortarName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
