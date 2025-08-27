import {
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
import TextField from "@components/TextField";
import { PropertyType } from "@ts/property";
import { formatKoreanPrice } from "@utils/numberUtil";

interface TransactionTypeSectionProps {
  type: PropertyType;
  price: string;
  deposit: string;
  monthlyRent: string;
  onTypeChange: (type: PropertyType) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepositChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMonthlyRentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepositBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onMonthlyRentBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPriceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  depositError: string | null;
  monthlyRentError: string | null;
  priceError: string | null;
}

const TransactionTypeSection = ({
  type,
  price,
  deposit,
  monthlyRent,
  onTypeChange,
  onPriceChange,
  onDepositChange,
  onMonthlyRentChange,
  onPriceBlur,
  onDepositBlur,
  onMonthlyRentBlur,
  depositError,
  monthlyRentError,
  priceError,
}: TransactionTypeSectionProps) => {
  return (
    <div className="p-5 card">
      <h6 className="font-semibold">거래 유형</h6>

      <div className="flex flex-col gap-4">
        <RadioGroup
          row
          value={type}
          onChange={(event) => onTypeChange(event.target.value as PropertyType)}
        >
          <FormControlLabel value="SALE" control={<Radio />} label="매매" />
          <FormControlLabel value="DEPOSIT" control={<Radio />} label="전세" />
          <FormControlLabel value="MONTHLY" control={<Radio />} label="월세" />
        </RadioGroup>

        {type === "SALE" && (
          <TextField
            label="매매 가격"
            value={price}
            onChange={onPriceChange}
            fullWidth
            onBlur={onPriceBlur}
            error={!!priceError}
            helperText={priceError || formatKoreanPrice(price)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">만원</InputAdornment>
              ),
            }}
          />
        )}
        {type === "DEPOSIT" && (
          <TextField
            label="보증금"
            value={deposit}
            onChange={onDepositChange}
            fullWidth
            helperText={depositError || formatKoreanPrice(deposit)}
            error={!!depositError}
            onBlur={onDepositBlur}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">만원</InputAdornment>
              ),
            }}
          />
        )}
        {type === "MONTHLY" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="보증금"
              value={deposit}
              onChange={onDepositChange}
              fullWidth
              onBlur={onDepositBlur}
              error={!!depositError}
              helperText={depositError || formatKoreanPrice(deposit)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />
            <TextField
              label="월세"
              value={monthlyRent}
              onChange={onMonthlyRentChange}
              fullWidth
              onBlur={onMonthlyRentBlur}
              error={!!monthlyRentError}
              helperText={monthlyRentError || formatKoreanPrice(monthlyRent)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">만원</InputAdornment>
                ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTypeSection;
