"use client";
import { useState, useEffect, useCallback } from "react";
import {
  fetchMessageTemplates,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
} from "@/apis/messageService";
import { showToast } from "@/components/Toast";
import MessageTemplateView from "./MessageTemplateView";
import { MessageTemplate, MessageTemplateList } from "@/types/message";

const ALLOWED_VARIABLES = ["이름", "생년월일", "관심지역"] as const;

const TEMPLATE_LIST_INITIAL: MessageTemplateList[] = [
  { id: 1, name: "일반", category: "GENERAL", templates: [] },
  { id: 2, name: "생일", category: "BIRTHDAY", templates: [] },
  { id: 3, name: "계약 만료", category: "EXPIRED_NOTI", templates: [] },
];
function MessageTemplateContainer() {
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [templateList, setTemplateList] = useState<MessageTemplateList[]>(
    TEMPLATE_LIST_INITIAL
  );
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const templates = await fetchMessageTemplates();

      setTemplateList((prev) =>
        prev.map((category) => ({
          ...category,
          templates: templates.filter(
            (template) => template.category === category.category
          ) as MessageTemplate[],
        }))
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setTemplateTitle(template.name);
    setTemplateContent(template.content);
    setSelectedCategory(template.category);
  };

  const handleAddNewTemplate = () => {
    setSelectedTemplate(null);
    setTemplateTitle("");
    setTemplateContent("");
    setSelectedCategory("");
  };

  const handleCreateTemplate = async () => {
    if (!templateTitle || !templateContent || !selectedCategory) {
      showToast({
        message: "모든 필드를 입력해주세요.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      await createMessageTemplate({
        name: templateTitle,
        content: templateContent,
        category: selectedCategory as MessageTemplate["category"],
      });

      fetchTemplates();
      handleAddNewTemplate(); // Reset form
      showToast({
        message: "템플릿을 생성했습니다.",
        type: "success",
      });
    } catch (error: unknown) {
      const err = error as Error;
      showToast({
        message:
          err?.message ||
          "템플릿 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (
      !selectedTemplate ||
      !templateTitle ||
      !templateContent ||
      !selectedCategory
    ) {
      showToast({
        message: "모든 필드를 입력해주세요.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateMessageTemplate(selectedTemplate.uid, {
        name: templateTitle,
        content: templateContent,
        category: selectedCategory as MessageTemplate["category"],
      });

      fetchTemplates();
      showToast({
        message: "템플릿을 수정했습니다.",
        type: "success",
      });
    } catch (error: unknown) {
      const err = error as Error;
      showToast({
        message:
          err?.message ||
          "템플릿 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setIsLoading(true);
      await deleteMessageTemplate(selectedTemplate.uid);

      fetchTemplates();
      handleAddNewTemplate();
      setOpenDeleteDialog(false);
      showToast({
        message: "템플릿을 삭제했습니다.",
        type: "success",
      });
    } catch (error: unknown) {
      const err = error as Error;
      showToast({
        message:
          err?.message ||
          "템플릿 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasBrokenVariable = (() => {
    const regex = /({{[^}]*}}|{{[^}]*|[^{{}]*}})/g;
    let match;
    while ((match = regex.exec(templateContent)) !== null) {
      const part = match[0];
      if (part.startsWith("{{") && !part.endsWith("}}")) {
        const extractedVar = part.slice(2).trim();
        if (ALLOWED_VARIABLES.some((v) => extractedVar.startsWith(v))) {
          return true;
        }
      }
    }
    return false;
  })();

  return (
    <MessageTemplateView
      templateTitle={templateTitle}
      templateContent={templateContent}
      selectedTemplate={selectedTemplate}
      selectedCategory={selectedCategory}
      templateList={templateList}
      isLoading={isLoading}
      openDeleteDialog={openDeleteDialog}
      hasBrokenVariable={hasBrokenVariable}
      allowedVariables={ALLOWED_VARIABLES}
      onTemplateTitleChange={setTemplateTitle}
      onTemplateContentChange={setTemplateContent}
      onCategoryChange={setSelectedCategory}
      onTemplateSelect={handleTemplateSelect}
      onAddNewTemplate={handleAddNewTemplate}
      onCreateTemplate={handleCreateTemplate}
      onUpdateTemplate={handleUpdateTemplate}
      onOpenDeleteDialog={handleOpenDeleteDialog}
      onDeleteTemplate={handleDeleteTemplate}
      onCloseDeleteDialog={() => setOpenDeleteDialog(false)}
    />
  );
}

export default MessageTemplateContainer;
