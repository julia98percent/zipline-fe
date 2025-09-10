"use client";
import { useState } from "react";
import { Snackbar, Alert, SelectChangeEvent } from "@mui/material";
import { MessageTemplate } from "@/types/message";
import { Customer } from "@/types/customer";
import MessageTemplateSection from "./MessageTemplateSection";
import CustomerManagementSection from "./CustomerManagementSection";
import CustomerSelectModal from "./CustomerSelectModal";

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
}: BulkMessagePageProps) => {
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  return (
    <>
      <div className="p-5 pt-0">
        <div className="flex flex-col lg:flex-row gap-7">
          <div className="flex-1">
            <MessageTemplateSection
              selectedTemplate={selectedTemplate}
              messageContent={messageContent}
              isLoading={isLoading}
              groupedTemplates={groupedTemplates}
              onTemplateChange={onTemplateChange}
            />
          </div>

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
      </div>

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
        className="!bottom-6"
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          className={`w-full min-w-60 rounded-lg border ${
            toast.severity === "success"
              ? "bg-blue-50 text-blue-700 border-blue-700"
              : "bg-red-50 text-red-700 border-red-700"
          }`}
          sx={{
            "& .MuiAlert-icon": {
              color: toast.severity === "success" ? "#164F9E" : "#D32F2F",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BulkMessagePage;
