import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Customer } from "@ts/customer";
import CustomerRoleChips from "./CustomerRoleChips";
import CircularProgress from "@components/CircularProgress";

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
    <List className="h-[320px] overflow-y-auto border border-[#eee] rounded-lg bg-white mb-4">
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
                ? "#F6F8FF"
                : "#F8F9FA",
              cursor: "pointer",
              border: selectedCustomers.some((c) => c.uid === customer.uid)
                ? "1px solid #164F9E"
                : "1px solid transparent",
              "&:hover": {
                backgroundColor: selectedCustomers.some(
                  (c) => c.uid === customer.uid
                )
                  ? "#EBF2FC"
                  : "#E0E0E0",
              },
            }}
            onClick={() => onCustomerSelect(customer)}
          >
            <ListItemText
              primary={customer.name}
              secondary={<CustomerRoleChips customer={customer} />}
            />
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
