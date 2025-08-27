import { MenuItem, StringSelect } from "@components/Select";

interface Customer {
  uid: number;
  name: string;
}

interface CustomerSelectSectionProps {
  customerUid: number | null;
  customers: Customer[];
  onCustomerChange: (uid: string) => void;
}

const CustomerSelectSection = ({
  customerUid,
  customers,
  onCustomerChange,
}: CustomerSelectSectionProps) => {
  return (
    <div className="p-5 card">
      <StringSelect
        label="고객 선택"
        value={customerUid !== null ? customerUid.toString() : ""}
        onChange={(e) => onCustomerChange(e.target.value)}
        fullWidth
        showEmptyOption={true}
        size="medium"
      >
        {customers.map((customer) => (
          <MenuItem key={customer.uid} value={customer.uid.toString()}>
            {customer.name}
          </MenuItem>
        ))}
      </StringSelect>
    </div>
  );
};

export default CustomerSelectSection;
