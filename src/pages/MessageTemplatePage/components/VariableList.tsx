import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AllowedVariable } from "@ts/message";

interface VariableListProps {
  allowedVariables: readonly AllowedVariable[];
  templateContent: string;
  onTemplateContentChange: (value: string) => void;
}

const VariableList: React.FC<VariableListProps> = ({
  allowedVariables,
  templateContent,
  onTemplateContentChange,
}) => {
  const VARIABLE_LIST = allowedVariables.map((key) => ({
    label: key,
    key,
  }));

  const handleVariableClick = (variable: { label: string; key: string }) => {
    const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
    const cursorPosition = textarea?.selectionStart ?? templateContent.length;
    onTemplateContentChange(
      templateContent.slice(0, cursorPosition) +
        `{{${variable.key}}}` +
        templateContent.slice(cursorPosition)
    );
  };

  return (
    <Paper className="p-6 rounded-lg shadow-sm">
      <Typography variant="h6" className="mb-4 text-gray-800">
        변수 목록
      </Typography>
      <List className="py-0">
        {VARIABLE_LIST.map((variable) => (
          <ListItem
            key={variable.key}
            className="px-3 py-2 cursor-pointer rounded-md transition-all duration-200 mb-1"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(22, 79, 158, 0.04)",
                "& .variable-insert-icon": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
            onClick={() => handleVariableClick(variable)}
          >
            <ListItemText
              primary={
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center">
                    <Typography
                      variant="body2"
                      className="text-gray-800 font-medium"
                    >
                      {variable.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-gray-600 ml-2"
                    >
                      {`{{${variable.key}}}`}
                    </Typography>
                  </Box>
                  <Box className="variable-insert-icon text-xs flex items-center gap-1 transition-all duration-200 opacity-0 transform -translate-x-1 text-primary">
                    <Typography variant="caption" className="font-medium">
                      추가
                    </Typography>
                    <Box
                      component="span"
                      className="w-4 h-4 flex items-center justify-center rounded bg-primary text-white text-xs"
                    >
                      +
                    </Box>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      <Typography
        variant="caption"
        color="textSecondary"
        className="mt-2 block"
      >
        변수는 반드시 <b>{"{{변수명}}"}</b> 형태로만 입력해 주세요.
        <br />
        (예: {"{{이름}}"}, {"{{생년월일}}"}, {"{{관심지역}}"})
      </Typography>
    </Paper>
  );
};

export default VariableList;
