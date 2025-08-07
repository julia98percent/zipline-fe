import React from "react";
import { TextField, Paper } from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import {
  MessageTemplate,
  MessageTemplateList,
  AllowedVariable,
} from "@ts/message";
import TemplatePreview from "./TemplatePreview";
import Button from "@components/Button";

interface TemplateEditorProps {
  templateTitle: string;
  templateContent: string;
  selectedTemplate: MessageTemplate | null;
  selectedCategory: string;
  templateList: MessageTemplateList[];
  isLoading: boolean;
  hasBrokenVariable: boolean;
  allowedVariables: readonly AllowedVariable[];
  onTemplateTitleChange: (value: string) => void;
  onTemplateContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddNewTemplate: () => void;
  onCreateTemplate: () => void;
  onUpdateTemplate: () => void;
  onOpenDeleteDialog: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateTitle,
  templateContent,
  selectedTemplate,
  selectedCategory,
  templateList,
  isLoading,
  hasBrokenVariable,
  allowedVariables,
  onTemplateTitleChange,
  onTemplateContentChange,
  onCategoryChange,
  onAddNewTemplate,
  onCreateTemplate,
  onUpdateTemplate,
  onOpenDeleteDialog,
}) => {
  return (
    <Paper className="flex-1 p-5 rounded-lg shadow-sm">
      <div className="flex gap-7 mb-4">
        <TextField
          fullWidth
          size="small"
          placeholder="템플릿 제목"
          value={templateTitle}
          onChange={(e) => onTemplateTitleChange(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as string)}
          displayEmpty
          className="min-w-[200px]"
        >
          <MenuItem value="" disabled>
            카테고리 선택
          </MenuItem>
          {templateList.map((category) => (
            <MenuItem key={category.id} value={category.category}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="템플릿 내용을 입력하세요"
        value={templateContent}
        onChange={(e) => onTemplateContentChange(e.target.value)}
      />

      <TemplatePreview
        templateContent={templateContent}
        allowedVariables={allowedVariables}
        hasBrokenVariable={hasBrokenVariable}
      />

      <div className="flex justify-end gap-3 mt-4">
        {selectedTemplate && (
          <Button variant="text" onClick={onAddNewTemplate} color="info">
            취소
          </Button>
        )}
        {selectedTemplate && selectedTemplate.category === "GENERAL" && (
          <Button variant="outlined" color="error" onClick={onOpenDeleteDialog}>
            삭제하기
          </Button>
        )}
        <Button
          variant="contained"
          onClick={selectedTemplate ? onUpdateTemplate : onCreateTemplate}
          disabled={
            isLoading ||
            !templateTitle ||
            !templateContent ||
            !selectedCategory ||
            hasBrokenVariable
          }
        >
          {selectedTemplate ? "수정하기" : "저장하기"}
        </Button>
      </div>
    </Paper>
  );
};

export default TemplateEditor;
