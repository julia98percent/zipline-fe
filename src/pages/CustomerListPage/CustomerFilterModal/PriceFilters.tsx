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
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        금액 조건
      </Typography>
      {priceCategories.map((category) => (
        <Box key={category.label} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {category.label}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
