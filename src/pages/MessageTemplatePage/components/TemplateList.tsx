import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { MessageTemplate, MessageTemplateList } from "@ts/message";
import Button from "@components/Button";

interface TemplateListProps {
  templateList: MessageTemplateList[];
  selectedTemplate: MessageTemplate | null;
  onTemplateSelect: (template: MessageTemplate) => void;
  onAddNewTemplate: () => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templateList,
  selectedTemplate,
  onTemplateSelect,
  onAddNewTemplate,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: "#333333" }}>
        템플릿 목록
      </Typography>
      <List sx={{ py: 0 }}>
        {templateList.map((category) => (
          <Box key={category.id}>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemText
                primary={category.name}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: "bold",
                    color: "#333333",
                    fontSize: "0.9rem",
                  },
                }}
              />
            </ListItem>
            {category.templates.map((template) => (
              <ListItem
                key={template.uid}
                sx={{
                  pl: 2,
                  py: 0.5,
                  cursor: "pointer",
                  minHeight: "32px",
                  backgroundColor:
                    selectedTemplate?.uid === template.uid
                      ? "#F0F7FF"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "#F0F7FF",
                  },
                }}
                onClick={() => onTemplateSelect(template)}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          selectedTemplate?.uid === template.uid
                            ? "#164F9E"
                            : "#666666",
                        "&:hover": { color: "#164F9E" },
                        fontSize: "0.875rem",
                      }}
                    >
                      • {template.name}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 0.5 }} />
          </Box>
        ))}
      </List>
      <Button
        onClick={onAddNewTemplate}
        className="w-full mt-2 border border-[#164F9E] bg-white text-[#164F9E] rounded px-4 py-2 hover:border-[#0D3B7A] hover:bg-[rgba(22,79,158,0.04)] transition-colors"
      >
        템플릿 추가하기
      </Button>
    </Paper>
  );
};

export default TemplateList;
