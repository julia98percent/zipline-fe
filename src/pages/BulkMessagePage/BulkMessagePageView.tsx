import { useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import { SelectChangeEvent } from "@mui/material";
import { MessageTemplate } from "@ts/message";
import { Customer } from "@ts/customer";
import {
  MessageTemplateSection,
  CustomerManagementSection,
  CustomerSelectModal,
} from "./components";

interface BulkMessagePageProps {
  messageContent: string;
  customers: Customer[];
  isCustomerModalOpen: boolean;
  isLoading: boolean;
  selectedTemplate: number | "";
  groupedTemplates: Record<string, MessageTemplate[]>;
  onTemplateChange: (event: SelectChangeEvent<number | string>) => void;
  onAddCustomer: () => void;
  onCustomerSelectConfirm: (selectedCustomers: Customer[]) => void;
  onRemoveCustomer: (index: number) => void;
  onSendMessage: () => void;
  onCloseCustomerModal: () => void;
  onMobileMenuToggle?: () => void;
}

const BulkMessagePage = ({
  selectedTemplate,
  messageContent,
  customers,
  isCustomerModalOpen,
  isLoading,
  groupedTemplates,
  onTemplateChange,
  onAddCustomer,
  onCustomerSelectConfirm,
  onRemoveCustomer,
  onSendMessage,
  onCloseCustomerModal,
  onMobileMenuToggle,
}: BulkMessagePageProps) => {
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader
        title="단체 문자 발송"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <Box sx={{ p: 3 }}>
        <div className="flex flex-col lg:flex-row gap-7">
          {/* 왼쪽 영역: 문자 템플릿 선택 및 내용 */}
          <div className="flex-1">
            <MessageTemplateSection
              selectedTemplate={selectedTemplate}
              messageContent={messageContent}
              isLoading={isLoading}
              groupedTemplates={groupedTemplates}
              onTemplateChange={onTemplateChange}
            />
          </div>

          {/* 오른쪽 영역: 고객 추가 */}
          <div className="flex-1 lg:max-w-md">
            <CustomerManagementSection
              customers={customers}
              selectedTemplate={selectedTemplate}
              onAddCustomer={onAddCustomer}
              onRemoveCustomer={onRemoveCustomer}
              onSendMessage={onSendMessage}
            />
          </div>
        </div>
      </Box>

      <CustomerSelectModal
        open={isCustomerModalOpen}
        onClose={onCloseCustomerModal}
        onConfirm={onCustomerSelectConfirm}
        selectedCustomers={customers}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: "24px !important" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{
            width: "100%",
            minWidth: "240px",
            borderRadius: "8px",
            backgroundColor:
              toast.severity === "success" ? "#F6F8FF" : "#FFF5F5",
            color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            border: `1px solid ${
              toast.severity === "success" ? "#164F9E" : "#D32F2F"
            }`,
            "& .MuiAlert-icon": {
              color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkMessagePage;
