import { InputAdornment } from "@mui/material";
import TextField from "@components/TextField";
import { NumericInputResponse } from "@hooks/useNumericInput";
import { formatKoreanPrice } from "@utils/numberUtil";

interface PriceSectionProps {
  showSalePrice: boolean;
  showRentPrice: boolean;
  minPriceInput: NumericInputResponse;
  minRentInput: NumericInputResponse;
  minDepositInput: NumericInputResponse;
  maxPriceInput: NumericInputResponse;
  maxRentInput: NumericInputResponse;
  maxDepositInput: NumericInputResponse;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PriceSection({
  showSalePrice,
  showRentPrice,
  minPriceInput,
  minRentInput,
  minDepositInput,
  maxPriceInput,
  maxRentInput,
  maxDepositInput,
}: PriceSectionProps) {
  const allCategories = [
    {
      label: "매매가",
      min: minPriceInput,
      max: maxPriceInput,
      fields: ["Price"],
      show: showSalePrice,
    },
    {
      label: "보증금",
      min: minDepositInput,
      max: maxDepositInput,
      fields: ["Deposit"],
      show: showRentPrice,
    },
    {
      label: "임대료",
      min: minRentInput,
      max: maxRentInput,
      fields: ["Rent"],
      show: showRentPrice,
    },
  ];

  const priceCategories = allCategories.filter((category) => category.show);

  return (
    <div
      className={`flex flex-col border-b border-gray-200 ${
        priceCategories.length && "pb-4 mb-4 mt-2"
      }`}
    >
      {priceCategories.map((category) => (
        <div key={category.label} className="flex flex-col mb-3">
          <div className="flex items-start justify-center gap-4 items-center">
            <TextField
              label={`최소 ${category.label}`}
              value={category.min.value || ""}
              onChange={category.min.handleChange}
              onBlur={category.min.handleBlur}
              error={!!category.min.error}
              helperText={
                category.min.error || formatKoreanPrice(category.min.value)
              }
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />

            <span className="mt-4">~</span>
            <TextField
              label={`최대 ${category.label}`}
              value={category.max.value || ""}
              onChange={category.max.handleChange}
              onBlur={category.max.handleBlur}
              error={!!category.max.error}
              helperText={
                category.max.error || formatKoreanPrice(category.max.value)
              }
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
}
