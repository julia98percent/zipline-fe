import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Customer } from "@ts/customer";

interface CustomerManagementSectionProps {
  customers: Customer[];
  selectedTemplate: number | "";
  onAddCustomer: () => void;
  onRemoveCustomer: (index: number) => void;
  onSendMessage: () => void;
}

const CustomerManagementSection = ({
  customers,
  selectedTemplate,
  onAddCustomer,
  onRemoveCustomer,
  onSendMessage,
}: CustomerManagementSectionProps) => {
  return (
    <Box sx={{ width: "400px" }}>
      <Paper
        sx={{
          p: 3,
          mb: 2,
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#333333" }}>
            고객 추가
          </Typography>
          <Button
            variant="contained"
            onClick={onAddCustomer}
            sx={{
              backgroundColor: "#164F9E",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#0D3B7A",
                boxShadow: "none",
              },
            }}
          >
            고객 선택하기
          </Button>
        </Box>
        <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
          {customers.map((customer, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: "28px",
                backgroundColor: "#F8F9FA",
                borderRadius: "4px",
              }}
            >
              <Box>
                <Typography variant="body1">{customer.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {customer.phoneNo}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => onRemoveCustomer(index)}>
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        onClick={onSendMessage}
        disabled={customers.length === 0 || !selectedTemplate}
        sx={{
          height: "48px",
          backgroundColor: "#164F9E",
          "&:hover": {
            backgroundColor: "#0D3B7A",
          },
          "&.Mui-disabled": {
            backgroundColor: "#E0E0E0",
            color: "#9E9E9E",
          },
        }}
      >
        {customers.length === 0
          ? "고객을 추가해주세요"
          : !selectedTemplate
          ? "템플릿을 선택해주세요"
          : `${customers.length}명에게 발송하기`}
      </Button>
    </Box>
  );
};

export default CustomerManagementSection;
