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
  onMobileMenuToggle?: () => void;
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
  onMobileMenuToggle,
}: MessageTemplatePageViewProps) {
  return (
    <Box className="p-0 pb-6 min-h-screen bg-gray-100">
      <PageHeader title="문자 템플릿" onMobileMenuToggle={onMobileMenuToggle} />

      <Box className="p-6">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* 데스크톱: 왼쪽 영역 (템플릿 목록 + 변수 목록) / 모바일: 템플릿 목록 */}
          <div className="lg:w-80 flex flex-col gap-7">
            <TemplateList
              templateList={templateList}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={onTemplateSelect}
              onAddNewTemplate={onAddNewTemplate}
            />

            {/* 데스크톱에서만 변수 목록 표시 */}
            <div className="hidden lg:block">
              <VariableList
                allowedVariables={allowedVariables}
                templateContent={templateContent}
                onTemplateContentChange={onTemplateContentChange}
              />
            </div>
          </div>

          {/* 템플릿 작성 영역 */}
          <div className="flex-1">
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
          </div>

          {/* 모바일에서만 변수 목록 표시 (맨 아래) */}
          <div className="lg:hidden">
            <VariableList
              allowedVariables={allowedVariables}
              templateContent={templateContent}
              onTemplateContentChange={onTemplateContentChange}
            />
          </div>
        </div>
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
