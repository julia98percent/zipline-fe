import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import BulkMessagePage, { Customer, Template } from "./BulkMessagePage";
import apiClient from "@apis/apiClient";
import { showToast } from "@components/Toast/Toast";

interface TemplateResponse {
  success: boolean;
  code: number;
  message: string;
  data: Template[];
}

const BulkMessagePageContainer = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
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
      "{{관심지역}}": customer.legalDistrictCode
        ? `$$###{${customer.legalDistrictCode}}`
        : "",
    };

    return content.replace(/{{[^}]+}}/g, (match) => {
      return replacements[match as keyof typeof replacements] || match;
    });
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await apiClient.get<TemplateResponse>(
          "/templates"
        );

        if (response.success && response.code === 200) {
          setTemplates(response.data);
        } else {
          console.error("Failed to fetch templates:", response.message);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
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
    const from = import.meta.env.VITE_MSG_PHONE_NUMBER;
    const template = templates.find((t) => t.uid === selectedTemplate);
    if (!template) return;

    const payload = customers.map((customer) => ({
      from,
      to: customer.phoneNo.replace(/\D/g, ""),
      text: replaceVariablesWithCustomerInfo(template.content, customer),
    }));

    try {
      await apiClient.post("/messages", payload);
      showToast({
        message: "문자를 발송했습니다.",
        type: "success",
      });
      setCustomers([]);
      setSelectedTemplate("");
      setMessageContent("");
    } catch {
      showToast({
        message: "문자 발송에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <BulkMessagePage
      templates={templates}
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

export default BulkMessagePageContainer;
