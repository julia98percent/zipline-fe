import { IconButton } from "@mui/material";
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
    <div className="w-full">
      <div className="p-3 mb-4 card">
        <div
          className={`flex justify-between items-center ${
            customers.length && "mb-2"
          }`}
        >
          <h6 className="text-lg font-semibold text-primary">
            문자 발송 대상 고객
          </h6>
          <Button variant="contained" color="primary" onClick={onAddCustomer}>
            고객 선택하기
          </Button>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {customers.map((customer, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 mt-2 bg-gray-50 rounded"
            >
              <div className="flex flex-col">
                <span className="font-medium">{customer.name}</span>
                <span className="text-sm text-gray-500">
                  {customer.phoneNo}
                </span>
              </div>
              <IconButton size="small" onClick={() => onRemoveCustomer(index)}>
                <CloseIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default CustomerManagementSection;
