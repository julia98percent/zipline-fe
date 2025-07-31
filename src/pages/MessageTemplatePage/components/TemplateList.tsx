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
    <Paper className="p-6 rounded-lg shadow-sm">
      <Typography variant="h6" className="mb-2 text-gray-800">
        템플릿 목록
      </Typography>
      <List className="py-0">
        {templateList.map((category) => (
          <Box key={category.id}>
            <ListItem className="px-0 py-1">
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
                className="pl-4 py-1 cursor-pointer min-h-8 hover:bg-blue-50"
                style={{
                  backgroundColor:
                    selectedTemplate?.uid === template.uid
                      ? "#F0F7FF"
                      : "transparent",
                }}
                onClick={() => onTemplateSelect(template)}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      className="text-sm hover:text-primary"
                      style={{
                        color:
                          selectedTemplate?.uid === template.uid
                            ? "#164F9E"
                            : "#666666",
                      }}
                    >
                      • {template.name}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <Divider className="my-1" />
          </Box>
        ))}
      </List>
      <Button
        onClick={onAddNewTemplate}
        className="w-full mt-2 border border-[#164F9E] bg-white text-[#164F9E] rounded px-4 py-2 hover:border-primary-dark hover:bg-[rgba(22,79,158,0.04)] transition-colors"
      >
        템플릿 추가하기
      </Button>
    </Paper>
  );
};

export default TemplateList;
