import { TextField } from "@mui/material";
import { FormErrors } from "@ts/contract";

interface Props {
  deposit: string;
  setDeposit: (deposit: string) => void;
  monthlyRent: string;
  setMonthlyRent: (monthlyRent: string) => void;
  price: string;
  setPrice: (price: string) => void;
  errors: FormErrors;
}

const ContractPriceSection = ({
  deposit,
  setDeposit,
  monthlyRent,
  setMonthlyRent,
  price,
  setPrice,
  errors,
}: Props) => {
  return (
    <>
      <TextField
        label="보증금 (숫자)"
        value={deposit}
        onChange={(e) => setDeposit(e.target.value)}
        error={!!errors.deposit}
        helperText={errors.deposit}
        type="number"
        fullWidth
        className="mt-4"
      />
      <TextField
        label="월세 (숫자)"
        value={monthlyRent}
        onChange={(e) => setMonthlyRent(e.target.value)}
        error={!!errors.monthlyRent}
        helperText={errors.monthlyRent}
        type="number"
        fullWidth
        className="mt-4"
      />
      <TextField
        label="매매가 (숫자)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        error={!!errors.price}
        helperText={errors.price}
        type="number"
        fullWidth
        className="mt-4"
      />
    </>
  );
};

export default ContractPriceSection;
