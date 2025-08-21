import { Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Customer } from "@ts/customer";
import Button from "@components/Button";

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
    <Box className="w-full">
      <Paper className="p-6 mb-4 rounded-lg shadow-sm">
        <Box className="flex justify-between items-center">
          <Typography className="text-xl font-medium">
            문자 발송 대상 고객
          </Typography>
          <Button variant="contained" color="primary" onClick={onAddCustomer}>
            고객 선택하기
          </Button>
        </Box>
        <Box className="max-h-[300px] overflow-y-auto">
          {customers.map((customer, index) => (
            <Box
              key={index}
              className="flex items-center justify-between p-2 mt-2 bg-gray-50 rounded"
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
        color="primary"
        onClick={onSendMessage}
        disabled={customers.length === 0 || !selectedTemplate}
      >
        {customers.length === 0
          ? "문자를 보낼 고객을 선택해주세요"
          : !selectedTemplate
          ? "템플릿을 선택해주세요"
          : `${customers.length}명에게 발송하기`}
      </Button>
    </Box>
  );
};

export default CustomerManagementSection;
