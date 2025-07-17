import React from "react";
import { TextField, Button, Paper } from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import {
  MessageTemplate,
  MessageTemplateList,
  AllowedVariable,
} from "@ts/message";
import TemplatePreview from "./TemplatePreview";

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
          placeholder="템플릿 제목"
          value={templateTitle}
          onChange={(e) => onTemplateTitleChange(e.target.value)}
          className="bg-white [&_.MuiOutlinedInput-root_fieldset]:border-gray-300 [&_.MuiOutlinedInput-root_fieldset]:rounded-3xl [&_.MuiOutlinedInput-root:hover_fieldset]:border-[#164F9E] [&_.MuiOutlinedInput-root.Mui-focused_fieldset]:border-[#164F9E]"
        />
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as string)}
          displayEmpty
          className="min-w-[200px] bg-white [&_.MuiOutlinedInput-notchedOutline]:border-gray-300 [&_.MuiOutlinedInput-notchedOutline]:rounded-3xl [&:hover_.MuiOutlinedInput-notchedOutline]:border-[#164F9E] [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-[#164F9E]"
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
        className="bg-white [&_.MuiOutlinedInput-root]:rounded-3xl [&_.MuiOutlinedInput-root_fieldset]:border-gray-300 [&_.MuiOutlinedInput-root:hover_fieldset]:border-[#164F9E] [&_.MuiOutlinedInput-root.Mui-focused_fieldset]:border-[#164F9E]"
      />

      <TemplatePreview
        templateContent={templateContent}
        allowedVariables={allowedVariables}
        hasBrokenVariable={hasBrokenVariable}
      />

      <div className="flex justify-end gap-3 mt-4">
        {selectedTemplate && (
          <Button
            variant="outlined"
            onClick={onAddNewTemplate}
            className="border-gray-300 text-gray-600 hover:border-gray-500 hover:bg-black/[0.04]"
          >
            취소
          </Button>
        )}
        {/* 일반 템플릿이고 선택된 템플릿이 있을 때만 삭제 버튼 표시 */}
        {selectedTemplate && selectedTemplate.category === "GENERAL" && (
          <Button
            variant="outlined"
            color="error"
            onClick={onOpenDeleteDialog}
            className="border-red-400 text-red-400 hover:border-red-500 hover:bg-red-400/[0.04]"
          >
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
          className="bg-[#164F9E] shadow-none hover:shadow-none hover:bg-[#0D3B7A] disabled:bg-[#164F9E]/40 disabled:text-white"
        >
          {selectedTemplate ? "수정하기" : "저장하기"}
        </Button>
      </div>
    </Paper>
  );
};

export default TemplateEditor;
