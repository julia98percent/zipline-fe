import { TextField } from "@mui/material";
import DaumPost from "@components/DaumPost";
import { Dispatch, SetStateAction } from "react";

interface AddressSectionProps {
  address: string | null;
  detailAddress: string;
  onAddressChange: Dispatch<SetStateAction<string | null>>;
  onDetailAddressChange: (detailAddress: string) => void;
}

const AddressSection = ({
  address,
  detailAddress,
  onAddressChange,
  onDetailAddressChange,
}: AddressSectionProps) => {
  return (
    <>
      <TextField
        label="주소"
        value={address ?? ""}
        variant="outlined"
        disabled
        fullWidth
        sx={{ mt: 2 }}
      />
      <DaumPost setAddress={onAddressChange} />
      <TextField
        label="상세 주소"
        value={detailAddress ?? ""}
        onChange={(e) => onDetailAddressChange(e.target.value)}
        disabled={!address}
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
      />
    </>
  );
};

export default AddressSection;
