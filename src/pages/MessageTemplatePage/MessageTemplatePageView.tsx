import { Box } from "@mui/material";
import DeleteConfirmModal from "@components/DeleteConfirm/DeleteConfirmModal";
import PageHeader from "@components/PageHeader/PageHeader";
import {
  MessageTemplate,
  MessageTemplateList,
  AllowedVariable,
} from "@ts/message";

import { TemplateList, VariableList, TemplateEditor } from "./components";

interface MessageTemplatePageViewProps {
  templateTitle: string;
  templateContent: string;
  selectedTemplate: MessageTemplate | null;
  selectedCategory: string;
  templateList: MessageTemplateList[];
  isLoading: boolean;
  openDeleteDialog: boolean;
  hasBrokenVariable: boolean;
  allowedVariables: readonly AllowedVariable[];
  onTemplateTitleChange: (value: string) => void;
  onTemplateContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTemplateSelect: (template: MessageTemplate) => void;
  onAddNewTemplate: () => void;
  onCreateTemplate: () => void;
  onUpdateTemplate: () => void;
  onOpenDeleteDialog: () => void;
  onDeleteTemplate: () => void;
  onCloseDeleteDialog: () => void;
}

function MessageTemplatePageView({
  templateTitle,
  templateContent,
  selectedTemplate,
  selectedCategory,
  templateList,
  isLoading,
  openDeleteDialog,
  hasBrokenVariable,
  allowedVariables,
  onTemplateTitleChange,
  onTemplateContentChange,
  onCategoryChange,
  onTemplateSelect,
  onAddNewTemplate,
  onCreateTemplate,
  onUpdateTemplate,
  onOpenDeleteDialog,
  onDeleteTemplate,
  onCloseDeleteDialog,
}: MessageTemplatePageViewProps) {
  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader title="문자 템플릿" />

      <Box sx={{ p: 3, display: "flex", gap: "28px" }}>
        {/* 왼쪽 영역: 템플릿 목록과 변수 목록 */}
        <Box
          sx={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <TemplateList
            templateList={templateList}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={onTemplateSelect}
            onAddNewTemplate={onAddNewTemplate}
          />

          <VariableList
            allowedVariables={allowedVariables}
            templateContent={templateContent}
            onTemplateContentChange={onTemplateContentChange}
          />
        </Box>

        {/* 오른쪽 영역: 템플릿 작성 */}
        <TemplateEditor
          templateTitle={templateTitle}
          templateContent={templateContent}
          selectedTemplate={selectedTemplate}
          selectedCategory={selectedCategory}
          templateList={templateList}
          isLoading={isLoading}
          hasBrokenVariable={hasBrokenVariable}
          allowedVariables={allowedVariables}
          onTemplateTitleChange={onTemplateTitleChange}
          onTemplateContentChange={onTemplateContentChange}
          onCategoryChange={onCategoryChange}
          onAddNewTemplate={onAddNewTemplate}
          onCreateTemplate={onCreateTemplate}
          onUpdateTemplate={onUpdateTemplate}
          onOpenDeleteDialog={onOpenDeleteDialog}
        />
      </Box>

      <DeleteConfirmModal
        open={openDeleteDialog}
        onConfirm={onDeleteTemplate}
        onCancel={onCloseDeleteDialog}
        category="문자 템플릿"
      />
    </Box>
  );
}

export default MessageTemplatePageView;
