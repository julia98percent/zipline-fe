import React from "react";
import {
  Typography,
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
    <div className="p-5 card">
      <h6 className="text-lg font-semibold text-primary mb-2">템플릿 목록</h6>
      <List className="py-0">
        {templateList.map((category) => (
          <div key={category.id}>
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
          </div>
        ))}
      </List>
      <Button
        onClick={onAddNewTemplate}
        variant="outlined"
        fullWidth
        className="mt-2"
      >
        템플릿 추가하기
      </Button>
    </div>
  );
};

export default TemplateList;
