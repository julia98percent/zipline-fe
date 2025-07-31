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
    <div>
      <h5 className="text-lg font-bold mb-4">기본 정보</h5>
      <div className="flex flex-col gap-5 mb-5">
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
        <div>
          {/* 주소 */}
          <TextField
            label="주소"
            value={addressData.address ?? ""}
            variant="outlined"
            disabled
            fullWidth
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
        </div>
      </div>
    </div>
  );
};

export default CustomerAddressSection;
