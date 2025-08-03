import { TextField } from "@mui/material";

interface Props {
  deposit: string;
  setDeposit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  monthlyRent: string;
  setMonthlyRent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  price: string;
  setPrice: (e: React.ChangeEvent<HTMLInputElement>) => void;
  category?: string | null;
  handleDepositBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleMonthlyRentBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handlePriceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  depositError: string | null;
  monthlyError: string | null;
  priceError: string | null;
}

const ContractPriceSection = ({
  deposit,
  setDeposit,
  monthlyRent,
  setMonthlyRent,
  price,
  setPrice,
  category,
  handleDepositBlur,
  handleMonthlyRentBlur,
  handlePriceBlur,
  depositError,
  monthlyError,
  priceError,
}: Props) => {
  if (!category) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {category === "SALE" && (
        <TextField
          label="매매가"
          value={price}
          onChange={setPrice}
          fullWidth
          onBlur={handlePriceBlur}
          error={!!priceError}
          helperText={priceError}
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
          helperText={depositError}
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
            helperText={depositError}
          />
          <TextField
            label="월세"
            value={monthlyRent}
            onChange={setMonthlyRent}
            fullWidth
            onBlur={handleMonthlyRentBlur}
            error={!!monthlyError}
            helperText={monthlyError}
          />
        </>
      )}
    </div>
  );
};

export default ContractPriceSection;
