import { TextField, InputAdornment } from "@mui/material";
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
    <div>
      <h5 className="text-lg font-bold mb-2">금액 조건</h5>
      {priceCategories.map((category) => (
        <div key={category.label} className="flex flex-col mb-2">
          <h6 className="font-semibold mb-2">{category.label}</h6>

          <div className="flex gap-4 items-center">
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
            <span>~</span>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceFilters;
