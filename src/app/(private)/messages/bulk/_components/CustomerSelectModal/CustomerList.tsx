import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Customer } from "@/types/customer";
import CustomerRoleChips from "./CustomerRoleChips";
import CircularProgress from "@/components/CircularProgress";

interface CustomerListProps {
  customers: Customer[];
  selectedCustomers: Customer[];
  loading: boolean;
  onCustomerSelect: (customer: Customer) => void;
}

const CustomerList = ({
  customers,
  selectedCustomers,
  loading,
  onCustomerSelect,
}: CustomerListProps) => {
  return (
    <List className="h-[320px] overflow-y-auto">
      {loading ? (
        <Box className="h-full flex items-center justify-center">
          <CircularProgress size={36} />
        </Box>
      ) : (
        customers.map((customer) => (
          <ListItem
            key={customer.uid}
            className="mb-2 rounded-xs"
            sx={{
              backgroundColor: selectedCustomers.some(
                (c) => c.uid === customer.uid
              )
                ? "var(--color-primary-hover)"
                : "var(--color-background-alt)",
              cursor: "pointer",
              border: selectedCustomers.some((c) => c.uid === customer.uid)
                ? "1px solid var(--color-primary)"
                : "1px solid transparent",
              "&:hover": {
                backgroundColor: selectedCustomers.some(
                  (c) => c.uid === customer.uid
                )
                  ? "var(--color-primary-light-hover)"
                  : "var(--color-neutral-200)",
              },
            }}
            onClick={() => onCustomerSelect(customer)}
          >
            <div>
              <span className="text-md font-normal">{customer.name}</span>
              <div className="text-sm text-gray-500">
                <CustomerRoleChips customer={customer} />
              </div>
            </div>
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomerSelect(customer);
                }}
              >
                {selectedCustomers.some((c) => c.uid === customer.uid) ? (
                  <CloseIcon className="text-primary" />
                ) : (
                  <AddIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default CustomerList;
