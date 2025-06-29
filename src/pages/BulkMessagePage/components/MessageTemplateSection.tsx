import {
  Box,
  Typography,
  TextField,
  Paper,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  ListSubheader,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Template } from "@ts/message";

interface MessageTemplateSectionProps {
  templates: Template[];
  selectedTemplate: number | "";
  messageContent: string;
  isLoading: boolean;
  groupedTemplates: Record<string, Template[]>;
  onTemplateChange: (event: SelectChangeEvent<number | string>) => void;
}

const MessageTemplateSection = ({
  templates,
  selectedTemplate,
  messageContent,
  isLoading,
  groupedTemplates,
  onTemplateChange,
}: MessageTemplateSectionProps) => {
  return (
    <Paper
      sx={{
        flex: 1,
        p: 3,
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
        문자 템플릿 선택
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedTemplate}
          onChange={onTemplateChange}
          displayEmpty
          disabled={isLoading}
          renderValue={(selected) => {
            if (!selected) return <em>템플릿을 선택해주세요</em>;
            const template = templates.find((t) => t.uid === selected);
            return template?.name || "";
          }}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "20px",
            },
          }}
          MenuProps={{
            PaperProps: {
              borderRadius: "20px",
              sx: {
                maxHeight: 300,
                "& .MuiMenuItem-root": {
                  padding: "8px 16px",
                },
                "& .MuiListSubheader-root": {
                  backgroundColor: "#f5f5f5",
                  lineHeight: "32px",
                  fontSize: "0.875rem",
                },
              },
            },
          }}
        >
          <MenuItem value="">
            <em>템플릿을 선택해주세요</em>
          </MenuItem>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            Object.entries(groupedTemplates).map(
              ([category, categoryTemplates]) => [
                <ListSubheader key={category}>{category}</ListSubheader>,
                ...categoryTemplates.map((template) => (
                  <MenuItem
                    key={template.uid}
                    value={template.uid}
                    sx={{
                      pl: 4,
                      "&.Mui-selected": {
                        backgroundColor: "#E3F2FD !important",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#BBDEFB !important",
                      },
                    }}
                  >
                    {template.name}
                  </MenuItem>
                )),
              ]
            )
          )}
        </Select>
      </FormControl>
      <TextField
        disabled
        fullWidth
        multiline
        rows={10}
        value={messageContent}
        onChange={() => {}}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "20px",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",
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
    </Paper>
  );
};

export default MessageTemplateSection;
