import { TextField, MenuItem } from "@mui/material";

interface Customer {
  uid: number;
  name: string;
}

interface CustomerSelectSectionProps {
  customerUid: number | null;
  customers: Customer[];
  onCustomerChange: (uid: number) => void;
}

const CustomerSelectSection = ({
  customerUid,
  customers,
  onCustomerChange,
}: CustomerSelectSectionProps) => {
  return (
    <TextField
      select
      label="고객 선택"
      value={customerUid !== null ? customerUid.toString() : ""}
      onChange={(e) => onCustomerChange(Number(e.target.value))}
      fullWidth
      sx={{ mt: 2 }}
    >
      {customers.map((customer) => (
        <MenuItem key={customer.uid} value={customer.uid.toString()}>
          {customer.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomerSelectSection;
