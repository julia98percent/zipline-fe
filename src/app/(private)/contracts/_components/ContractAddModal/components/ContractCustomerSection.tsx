import { Autocomplete, TextField } from "@mui/material";
import { CustomerResponse } from "@/apis/contractService";

interface Props {
  lessorUids: number[];
  setLessorUids: (uids: number[]) => void;
  lesseeUids: number[];
  setLesseeUids: (uids: number[]) => void;
  customerOptions: CustomerResponse[];
}

const ContractCustomerSection = ({
  lessorUids,
  setLessorUids,
  lesseeUids,
  setLesseeUids,
  customerOptions,
}: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 card">
      <Autocomplete
        multiple
        options={customerOptions}
        getOptionLabel={(option) => option.name}
        value={customerOptions.filter((c) => lessorUids.includes(c.uid))}
        onChange={(_, newValue) => {
          setLessorUids(newValue.map((v) => v.uid));
        }}
        renderInput={(params) => (
          <TextField {...params} label="임대인" required />
        )}
      />
      <Autocomplete
        multiple
        options={customerOptions}
        getOptionLabel={(option) => option.name}
        value={customerOptions.filter((c) => lesseeUids.includes(c.uid))}
        onChange={(_, newValue) => {
          setLesseeUids(newValue.map((v) => v.uid));
        }}
        renderInput={(params) => <TextField {...params} label="임차인" />}
      />
    </div>
  );
};

export default ContractCustomerSection;
