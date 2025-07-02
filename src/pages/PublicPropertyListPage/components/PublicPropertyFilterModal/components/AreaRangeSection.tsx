import { Box, Slider, Typography } from "@mui/material";

interface AreaRangeSectionProps {
  minExclusiveArea?: number;
  maxExclusiveArea?: number;
  minSupplyArea?: number;
  maxSupplyArea?: number;
  onSliderChange: (
    field: string
  ) => (_: Event, newValue: number | number[]) => void;
}

export default function AreaRangeSection({
  minExclusiveArea,
  maxExclusiveArea,
  minSupplyArea,
  maxSupplyArea,
  onSliderChange,
}: AreaRangeSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        면적 범위
      </Typography>

      {/* Exclusive Area Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>전용면적 (㎡)</Typography>
        <Slider
          value={[minExclusiveArea || 0, maxExclusiveArea || 200]}
          onChange={onSliderChange("ExclusiveArea")}
          min={0}
          max={50000}
          step={500}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}㎡`}
        />
      </Box>

      {/* Supply Area Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>공급면적 (㎡)</Typography>
        <Slider
          value={[minSupplyArea || 0, maxSupplyArea || 200]}
          onChange={onSliderChange("SupplyArea")}
          min={0}
          max={50000}
          step={500}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}㎡`}
        />
      </Box>
    </Box>
  );
}
