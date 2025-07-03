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
    <Paper
      sx={{
        p: 3,
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
        변수 목록
      </Typography>
      <List sx={{ py: 0 }}>
        {VARIABLE_LIST.map((variable) => (
          <ListItem
            key={variable.key}
            sx={{
              px: 1.5,
              py: 1,
              cursor: "pointer",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              mb: 0.5,
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333333",
                        fontWeight: 500,
                      }}
                    >
                      {variable.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666666",
                        ml: 1,
                      }}
                    >
                      {`{{${variable.key}}}`}
                    </Typography>
                  </Box>
                  <Box
                    className="variable-insert-icon"
                    sx={{
                      color: "#164F9E",
                      fontSize: "0.75rem",
                      opacity: 0,
                      transform: "translateX(-4px)",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      추가
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        backgroundColor: "#164F9E",
                        color: "#FFFFFF",
                        fontSize: "12px",
                      }}
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
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
        변수는 반드시 <b>{"{{변수명}}"}</b> 형태로만 입력해 주세요.
        <br />
        (예: {"{{이름}}"}, {"{{생년월일}}"}, {"{{관심지역}}"})
      </Typography>
    </Paper>
  );
};

export default VariableList;
