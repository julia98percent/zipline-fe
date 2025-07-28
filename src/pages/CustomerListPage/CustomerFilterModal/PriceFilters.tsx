import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { FilterSectionProps } from "@ts/customer";

const PriceFilters = ({ filtersTemp, setFiltersTemp }: FilterSectionProps) => {
  const handleChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFiltersTemp((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

  const priceCategories = [
    { label: "매매가", fields: ["Price"] },
    { label: "보증금", fields: ["Deposit"] },
    { label: "임대료", fields: ["Rent"] },
  ];

  return (
    <Box className="mb-6">
      <Typography variant="h6" className="mb-4 font-semibold">
        금액 조건
      </Typography>
      {priceCategories.map((category) => (
        <Box key={category.label} className="mb-4">
          <Typography variant="subtitle2" className="mb-2">
            {category.label}
          </Typography>
          <Box className="flex gap-4 items-center">
            <TextField
              label="최소"
              type="text"
              inputMode="numeric"
              value={
                filtersTemp[
                  `min${category.fields[0]}` as keyof typeof filtersTemp
                ] || ""
              }
              onChange={handleChange(`min${category.fields[0]}`)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />
            <Typography>~</Typography>
            <TextField
              label="최대"
              type="text"
              inputMode="numeric"
              value={
                filtersTemp[
                  `max${category.fields[0]}` as keyof typeof filtersTemp
                ] || ""
              }
              onChange={handleChange(`max${category.fields[0]}`)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PriceFilters;
