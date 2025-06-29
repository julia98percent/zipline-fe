import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Customer } from "@ts/customer";
import CustomerRoleChips from "./CustomerRoleChips";

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
    <List
      sx={{
        height: 320,
        overflowY: "auto",
        border: "1px solid #eee",
        borderRadius: "8px",
        background: "#fff",
        mb: 2,
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        customers.map((customer) => (
          <ListItem
            key={customer.uid}
            sx={{
              borderRadius: 1,
              mb: 1,
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
                  <CloseIcon sx={{ color: "#164F9E" }} />
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
