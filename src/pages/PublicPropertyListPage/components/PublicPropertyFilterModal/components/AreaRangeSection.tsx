import { Box, Slider, Typography } from "@mui/material";

interface AreaRangeSectionProps {
  minNetArea?: number;
  maxNetArea?: number;
  minTotalArea?: number;
  maxTotalArea?: number;
  onSliderChange: (
    field: string
  ) => (_: Event, newValue: number | number[]) => void;
}

export default function AreaRangeSection({
  minNetArea,
  maxNetArea,
  minTotalArea,
  maxTotalArea,
  onSliderChange,
}: AreaRangeSectionProps) {
  return (
    <Box className="mb-6">
      <Typography variant="subtitle1" gutterBottom className="mb-4">
        면적 범위
      </Typography>

      {/* Exclusive Area Range */}
      <Box className="mb-6">
        <Typography gutterBottom>전용면적 (㎡)</Typography>
        <Slider
          value={[minNetArea || 0, maxNetArea || 200]}
          onChange={onSliderChange("NetArea")}
          min={0}
          max={50000}
          step={500}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}㎡`}
        />
      </Box>

      {/* Supply Area Range */}
      <Box className="mb-6">
        <Typography gutterBottom>공급면적 (㎡)</Typography>
        <Slider
          value={[minTotalArea || 0, maxTotalArea || 200]}
          onChange={onSliderChange("TotalArea")}
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
