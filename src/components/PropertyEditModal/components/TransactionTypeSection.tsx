import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import TextField from "@components/TextField";
import { PropertyType } from "@ts/property";

interface TransactionTypeSectionProps {
  type: PropertyType;
  price: string;
  deposit: string;
  monthlyRent: string;
  onTypeChange: (type: PropertyType) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepositChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMonthlyRentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
}: TransactionTypeSectionProps) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        거래 유형
      </Typography>
      <RadioGroup
        row
        value={type}
        onChange={(event) => onTypeChange(event.target.value as PropertyType)}
      >
        <FormControlLabel value="SALE" control={<Radio />} label="매매" />
        <FormControlLabel value="DEPOSIT" control={<Radio />} label="전세" />
        <FormControlLabel value="MONTHLY" control={<Radio />} label="월세" />
      </RadioGroup>

      {/* 조건부 TextField 렌더링 */}
      {type === "SALE" && (
        <TextField
          label="매매 가격"
          value={price}
          onChange={onPriceChange}
          sx={{ mt: 2 }}
          fullWidth
        />
      )}
      {type === "DEPOSIT" && (
        <TextField
          label="보증금"
          value={deposit}
          onChange={onDepositChange}
          sx={{ mt: 2 }}
          fullWidth
        />
      )}
      {type === "MONTHLY" && (
        <>
          <TextField
            label="보증금"
            value={deposit}
            onChange={onDepositChange}
            sx={{ mt: 2 }}
            fullWidth
          />
          <TextField
            label="월세"
            value={monthlyRent}
            onChange={onMonthlyRentChange}
            sx={{ mt: 2 }}
            fullWidth
          />
        </>
      )}
    </>
  );
};

export default TransactionTypeSection;
