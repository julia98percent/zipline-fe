import TextField from "@components/TextField";
import { MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import DaumPost from "@components/DaumPost";
import { Customer } from "@ts/customer";

interface CustomerData {
  uid: number | null;
  options: Customer[];
  onChange: (uid: number) => void;
}

interface AddressData {
  address: string | null;
  extraAddress: string;
  onAddressChange: (address: string | null) => void;
  onDaumPostAddressChange: React.Dispatch<React.SetStateAction<string | null>>;
  onExtraAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface CustomerAddressSectionProps {
  customerData: CustomerData;
  addressData: AddressData;
  createContract: boolean;
  onCreateContractChange: (checked: boolean) => void;
}

const CustomerAddressSection = ({
  customerData,
  addressData,
  createContract,
  onCreateContractChange,
}: CustomerAddressSectionProps) => {
  return (
    <>
      {/* 고객 선택 */}
      <TextField
        select
        label="고객 선택"
        value={customerData.uid !== null ? customerData.uid.toString() : ""}
        onChange={(e) => customerData.onChange(Number(e.target.value))}
        fullWidth
        required
      >
        {customerData.options.map((customer) => (
          <MenuItem key={customer.uid} value={customer.uid.toString()}>
            {customer.name}
          </MenuItem>
        ))}
      </TextField>

      {/* 주소 */}
      <TextField
        label="주소"
        value={addressData.address ?? ""}
        variant="outlined"
        disabled
        fullWidth
        className="mt-4"
        required
      />
      <DaumPost setAddress={addressData.onDaumPostAddressChange} />
      <TextField
        label="상세 주소"
        value={addressData.extraAddress ?? ""}
        onChange={addressData.onExtraAddressChange}
        disabled={!addressData.address}
        variant="outlined"
        fullWidth
      />

      {/* 계약 자동 생성 */}
      <FormControlLabel
        control={
          <Checkbox
            checked={createContract}
            onChange={(e) => onCreateContractChange(e.target.checked)}
          />
        }
        label="계약 자동 생성하기"
        className="mt-4"
      />
    </>
  );
};

export default CustomerAddressSection;
