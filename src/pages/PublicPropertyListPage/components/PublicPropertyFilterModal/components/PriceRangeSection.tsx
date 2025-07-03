import { Box, Slider, Typography } from "@mui/material";

interface PriceRangeSectionProps {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minDeposit?: number;
  maxDeposit?: number;
  minMonthlyRent?: number;
  maxMonthlyRent?: number;
  onSliderChange: (
    field: string
  ) => (_: Event, newValue: number | number[]) => void;
}

export default function PriceRangeSection({
  category,
  minPrice,
  maxPrice,
  minDeposit,
  maxDeposit,
  minMonthlyRent,
  maxMonthlyRent,
  onSliderChange,
}: PriceRangeSectionProps) {
  const formatPrice = (value: number) => {
    if (value >= 10000) {
      return `${Math.floor(value / 10000)}억 ${
        value % 10000 > 0 ? `${value % 10000}만` : ""
      }`;
    }
    return `${value}만`;
  };

  if (!category) return null;

  return (
    <>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        가격 범위
      </Typography>

      {/* Sale Price Range */}
      <Box
        sx={{
          mb: 3,
          display: category === "SALE" ? "block" : "none",
        }}
      >
        <Typography gutterBottom>매매가 (만원)</Typography>
        <Slider
          value={[minPrice || 0, maxPrice || 100000]}
          onChange={onSliderChange("Price")}
          min={1}
          max={1000000000}
          step={1000}
          valueLabelDisplay="auto"
          valueLabelFormat={formatPrice}
        />
      </Box>

      {/* Deposit Range */}
      <Box
        sx={{
          mb: 3,
          display:
            category === "MONTHLY" || category === "DEPOSIT" ? "block" : "none",
        }}
      >
        <Typography gutterBottom>보증금 (만원)</Typography>
        <Slider
          value={[minDeposit || 0, maxDeposit || 50000]}
          onChange={onSliderChange("Deposit")}
          min={1}
          max={10000000}
          step={10000000}
          valueLabelDisplay="auto"
          valueLabelFormat={formatPrice}
        />
      </Box>

      {/* Monthly Rent Range */}
      <Box
        sx={{
          mb: 3,
          display: category === "MONTHLY" ? "block" : "none",
        }}
      >
        <Typography gutterBottom>월세 (만원)</Typography>
        <Slider
          value={[minMonthlyRent || 0, maxMonthlyRent || 1000]}
          onChange={onSliderChange("MonthlyRent")}
          min={1}
          max={10000000}
          step={10000000}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}만`}
        />
      </Box>
    </>
  );
}
