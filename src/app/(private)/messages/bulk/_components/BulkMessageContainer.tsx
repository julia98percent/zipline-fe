"use client";
import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import BulkMessageView from "./BulkMessageView";
import { showToast } from "@/components/Toast";
import { fetchMessageTemplates, sendBulkMessages } from "@/apis/messageService";
import { Customer } from "@/types/customer";
import { MessageTemplate, BulkMessagePayload } from "@/types/message";
import useAuthStore from "@/stores/useAuthStore";

const BulkMessageContainer = () => {
  const { user } = useAuthStore();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | "">("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const replaceVariablesWithCustomerInfo = (
    content: string,
    customer: Customer
  ) => {
    const formatBirthday = (dateStr: string) => {
      try {
        const month = parseInt(dateStr.substring(4, 6), 10);
        const day = parseInt(dateStr.substring(6, 8), 10);
        return `${month}월 ${day}일`;
      } catch (error) {
        console.error("Invalid date format:", error);
        return "날짜 정보 없음";
      }
    };

    const replacements = {
      "{{이름}}": `${customer.name}`,
      "{{생년월일}}": customer.birthday
        ? formatBirthday(customer.birthday)
        : "생일 정보 없음",
      "{{관심지역}}": customer.preferredRegionKR
        ? `$$###{${customer.preferredRegionKR}}`
        : "",
    };

    return content.replace(/{{[^}]+}}/g, (match) => {
      return replacements[match as keyof typeof replacements] || match;
    });
  };

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const templatesData = await fetchMessageTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error loading templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleTemplateChange = (event: SelectChangeEvent<number | string>) => {
    const selectedTemplateUid =
      event.target.value === "" ? "" : Number(event.target.value);
    setSelectedTemplate(selectedTemplateUid);

    if (!selectedTemplateUid) {
      setMessageContent("");
      return;
    }

    const template = templates.find((t) => t.uid === selectedTemplateUid);
    if (template) {
      setMessageContent(template.content);
    }
  };

  const handleAddCustomer = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerSelectConfirm = (selectedCustomers: Customer[]) => {
    setCustomers(selectedCustomers);
  };

  const handleRemoveCustomer = (index: number) => {
    setCustomers(customers.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!customers.length || !selectedTemplate) return;

    const from = user?.phoneNo?.replace(/\D/g, "");
    if (!from) {
      showToast({
        message: "발신 번호를 확인할 수 없습니다.",
        type: "error",
      });
      return;
    }

    const template = templates.find((t) => t.uid === selectedTemplate);
    if (!template) return;

    const payload: BulkMessagePayload[] = customers.map((customer) => ({
      from,
      to: customer.phoneNo.replace(/\D/g, ""),
      text: replaceVariablesWithCustomerInfo(template.content, customer),
    }));

    try {
      await sendBulkMessages(payload);

      showToast({
        message: "문자를 발송했습니다.",
        type: "success",
      });
      setCustomers([]);
      setSelectedTemplate("");
      setMessageContent("");
    } catch (error) {
      console.error("Bulk message send error:", error);
      showToast({
        message: "문자 발송에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, MessageTemplate[]>);

  return (
    <BulkMessageView
      selectedTemplate={selectedTemplate}
      messageContent={messageContent}
      customers={customers}
      isCustomerModalOpen={isCustomerModalOpen}
      isLoading={isLoading}
      groupedTemplates={groupedTemplates}
      onTemplateChange={handleTemplateChange}
      onAddCustomer={handleAddCustomer}
      onCustomerSelectConfirm={handleCustomerSelectConfirm}
      onRemoveCustomer={handleRemoveCustomer}
      onSendMessage={handleSendMessage}
      onCloseCustomerModal={handleCloseCustomerModal}
    />
  );
};

export default BulkMessageContainer;
