import { InputAdornment, TextField } from "@mui/material";
import { NumericInputResponse } from "@/hooks/useNumericInput";
import { formatKoreanPrice } from "@/utils/numberUtil";

interface Props {
  category?: string | null;
  depositInput: NumericInputResponse;
  monthlyRentInput: NumericInputResponse;
  priceInput: NumericInputResponse;
}

const ContractPriceSection = ({
  category,
  depositInput,
  monthlyRentInput,
  priceInput,
}: Props) => {
  if (!category) {
    return null;
  }

  const {
    value: deposit,
    handleChange: setDeposit,
    error: depositError,
    handleBlur: handleDepositBlur,
  } = depositInput;
  const {
    value: monthlyRent,
    handleChange: setMonthlyRent,
    error: monthlyError,
    handleBlur: handleMonthlyRentBlur,
  } = monthlyRentInput;
  const {
    value: price,
    handleChange: setPrice,
    error: priceError,
    handleBlur: handlePriceBlur,
  } = priceInput;

  return (
    <div className="flex flex-col gap-4 p-5 card">
      {category === "SALE" && (
        <TextField
          label="매매가"
          value={price}
          onChange={setPrice}
          fullWidth
          onBlur={handlePriceBlur}
          error={!!priceError}
          helperText={priceError || formatKoreanPrice(price)}
          InputProps={{
            endAdornment: <InputAdornment position="end">만원</InputAdornment>,
          }}
        />
      )}

      {category === "DEPOSIT" && (
        <TextField
          label="보증금"
          value={deposit}
          onChange={setDeposit}
          fullWidth
          onBlur={handleDepositBlur}
          error={!!depositError}
          helperText={depositError || formatKoreanPrice(deposit)}
          InputProps={{
            endAdornment: <InputAdornment position="end">만원</InputAdornment>,
          }}
        />
      )}

      {category === "MONTHLY" && (
        <>
          <TextField
            label="보증금"
            value={deposit}
            onChange={setDeposit}
            fullWidth
            onBlur={handleDepositBlur}
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
            onChange={setMonthlyRent}
            fullWidth
            onBlur={handleMonthlyRentBlur}
            error={!!monthlyError}
            helperText={monthlyError || formatKoreanPrice(monthlyRent)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">만원</InputAdornment>
              ),
            }}
          />
        </>
      )}
    </div>
  );
};

export default ContractPriceSection;
