import React from "react";
import { Box, TextField, Button, Paper, Select, MenuItem } from "@mui/material";
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
    <Paper
      sx={{
        flex: 1,
        p: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", gap: "28px", mb: 2 }}>
        <TextField
          fullWidth
          placeholder="템플릿 제목"
          value={templateTitle}
          onChange={(e) => onTemplateTitleChange(e.target.value)}
          sx={{
            backgroundColor: "#FFFFFF",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E0E0E0",
                borderRadius: "20px",
              },
              "&:hover fieldset": {
                borderColor: "#164F9E",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#164F9E",
              },
            },
          }}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          displayEmpty
          sx={{
            minWidth: 200,
            backgroundColor: "#FFFFFF",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E0E0E0",
              borderRadius: "20px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#164F9E",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#164F9E",
            },
          }}
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
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="템플릿 내용을 입력하세요"
        value={templateContent}
        onChange={(e) => onTemplateContentChange(e.target.value)}
        sx={{
          backgroundColor: "#FFFFFF",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            "& fieldset": {
              borderColor: "#E0E0E0",
            },
            "&:hover fieldset": {
              borderColor: "#164F9E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#164F9E",
            },
          },
        }}
      />

      <TemplatePreview
        templateContent={templateContent}
        allowedVariables={allowedVariables}
        hasBrokenVariable={hasBrokenVariable}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          mt: 2,
        }}
      >
        {selectedTemplate && (
          <Button
            variant="outlined"
            onClick={onAddNewTemplate}
            sx={{
              borderColor: "#E0E0E0",
              color: "#666666",
              "&:hover": {
                borderColor: "#999999",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
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
            sx={{
              borderColor: "#FF5050",
              color: "#FF5050",
              "&:hover": {
                borderColor: "#FF3333",
                backgroundColor: "rgba(255, 80, 80, 0.04)",
              },
            }}
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
          sx={{
            backgroundColor: "#164F9E",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "#0D3B7A",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(22, 79, 158, 0.4)",
              color: "#fff",
            },
          }}
        >
          {selectedTemplate ? "수정하기" : "저장하기"}
        </Button>
      </Box>
    </Paper>
  );
};

export default TemplateEditor;
