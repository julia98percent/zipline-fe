import { Box, Chip } from "@mui/material";
import { Customer } from "@ts/customer";

interface CustomerRoleChipsProps {
  customer: Customer;
}

const CustomerRoleChips = ({ customer }: CustomerRoleChipsProps) => {
  return (
    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
      {customer.tenant && (
        <Chip
          label="임차인"
          size="small"
          sx={{ backgroundColor: "#FEF5EB", color: "#F2994A" }}
        />
      )}
      {customer.landlord && (
        <Chip
          label="임대인"
          size="small"
          sx={{ backgroundColor: "#FDEEEE", color: "#EB5757" }}
        />
      )}
      {customer.buyer && (
        <Chip
          label="매수자"
          size="small"
          sx={{ backgroundColor: "#E9F7EF", color: "#219653" }}
        />
      )}
      {customer.seller && (
        <Chip
          label="매도자"
          size="small"
          sx={{ backgroundColor: "#EBF2FC", color: "#2F80ED" }}
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
    </Box>
  );
};

export default CustomerRoleChips;
