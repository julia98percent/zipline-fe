import { Chip } from "@mui/material";
import { Customer } from "@ts/customer";
import { CUSTOMER_TYPE_COLORS } from "@constants/customer";

interface CustomerRoleChipsProps {
  customer: Customer;
}

const CustomerRoleChips = ({ customer }: CustomerRoleChipsProps) => {
  return (
    <div className="flex gap-1 mt-1">
      {customer.tenant && (
        <Chip
          label={CUSTOMER_TYPE_COLORS.tenant.label}
          size="small"
          sx={{
            backgroundColor: CUSTOMER_TYPE_COLORS.tenant.backgroundColor,
            color: CUSTOMER_TYPE_COLORS.tenant.color,
          }}
        />
      )}
      {customer.landlord && (
        <Chip
          label={CUSTOMER_TYPE_COLORS.landlord.label}
          size="small"
          sx={{
            backgroundColor: CUSTOMER_TYPE_COLORS.landlord.backgroundColor,
            color: CUSTOMER_TYPE_COLORS.landlord.color,
          }}
        />
      )}
      {customer.buyer && (
        <Chip
          label={CUSTOMER_TYPE_COLORS.buyer.label}
          size="small"
          sx={{
            backgroundColor: CUSTOMER_TYPE_COLORS.buyer.backgroundColor,
            color: CUSTOMER_TYPE_COLORS.buyer.color,
          }}
        />
      )}
      {customer.seller && (
        <Chip
          label={CUSTOMER_TYPE_COLORS.seller.label}
          size="small"
          sx={{
            backgroundColor: CUSTOMER_TYPE_COLORS.seller.backgroundColor,
            color: CUSTOMER_TYPE_COLORS.seller.color,
          }}
        />
      )}
      {customer.labels &&
        customer.labels.length > 0 &&
        customer.labels.map((label) => (
          <Chip
            key={label.uid}
            label={label.name}
            size="small"
            variant="outlined"
          />
        ))}
    </div>
  );
};

export default CustomerRoleChips;
