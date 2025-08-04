import { TextField, InputAdornment } from "@mui/material";
import { NumericInputResponse } from "@hooks/useNumericInput";

interface Props {
  minPriceInput: NumericInputResponse;
  maxPriceInput: NumericInputResponse;
  minRentInput: NumericInputResponse;
  maxRentInput: NumericInputResponse;
  minDepositInput: NumericInputResponse;
  maxDepositInput: NumericInputResponse;
}
const PriceFilters = ({
  minPriceInput,
  maxPriceInput,
  minRentInput,
  maxRentInput,
  minDepositInput,
  maxDepositInput,
}: Props) => {
  const priceCategories = [
    {
      label: "매매가",
      min: minPriceInput,
      max: maxPriceInput,
      fields: ["Price"],
    },
    {
      label: "보증금",
      min: minDepositInput,
      max: maxDepositInput,
      fields: ["Deposit"],
    },
    {
      label: "임대료",
      min: minRentInput,
      max: maxRentInput,
      fields: ["Rent"],
    },
  ];

  return (
    <div>
      <h5 className="text-lg font-bold mb-2">금액 조건</h5>
      {priceCategories.map((category) => (
        <div key={category.label} className="flex flex-col mb-2">
          <h6 className="font-semibold mb-2">{category.label}</h6>
          <div className="flex items-start justify-center gap-4 items-center">
            <TextField
              label="최소"
              value={category.min.value || ""}
              onChange={category.min.handleChange}
              onBlur={category.min.handleBlur}
              error={!!category.min.error}
              helperText={category.min.error}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />

            <span className="mt-4">~</span>
            <TextField
              label="최대"
              type="text"
              inputMode="numeric"
              value={category.max.value || ""}
              onChange={category.max.handleChange}
              onBlur={category.max.handleBlur}
              error={!!category.max.error}
              helperText={category.max.error}
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
