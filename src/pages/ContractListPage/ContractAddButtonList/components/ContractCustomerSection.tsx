import { Autocomplete, TextField } from "@mui/material";
import { CustomerResponse } from "@apis/contractService";
import { FormErrors } from "@ts/contract";

interface Props {
  lessorUids: number[];
  setLessorUids: (uids: number[]) => void;
  lesseeUids: number[];
  setLesseeUids: (uids: number[]) => void;
  customerOptions: CustomerResponse[];
  errors: FormErrors;
}

const ContractCustomerSection = ({
  lessorUids,
  setLessorUids,
  lesseeUids,
  setLesseeUids,
  customerOptions,
  errors,
}: Props) => {
  return (
    <>
      <Autocomplete
        multiple
        options={customerOptions}
        getOptionLabel={(option) => option.name}
        value={customerOptions.filter((c) => lessorUids.includes(c.uid))}
        onChange={(_, newValue) => {
          setLessorUids(newValue.map((v) => v.uid));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="임대인 *"
            error={!!errors.lessorUids}
            helperText={errors.lessorUids}
          />
        )}
        className="mt-4"
      />
      <Autocomplete
        multiple
        options={customerOptions}
        getOptionLabel={(option) => option.name}
        value={customerOptions.filter((c) => lesseeUids.includes(c.uid))}
        onChange={(_, newValue) => {
          setLesseeUids(newValue.map((v) => v.uid));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="임차인 *"
            error={!!errors.lesseeUids}
            helperText={errors.lesseeUids}
          />
        )}
        className="mt-4"
      />
    </>
  );
};

export default ContractCustomerSection;
