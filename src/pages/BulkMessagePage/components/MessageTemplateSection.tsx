import { SelectChangeEvent } from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import TextField from "@components/TextField";
import { MessageTemplate } from "@ts/message";

interface MessageTemplateSectionProps {
  selectedTemplate: number | "";
  messageContent: string;
  isLoading: boolean;
  groupedTemplates: Record<string, MessageTemplate[]>;
  onTemplateChange: (event: SelectChangeEvent<number | string>) => void;
}

const MessageTemplateSection = ({
  selectedTemplate,
  messageContent,
  isLoading,
  groupedTemplates,
  onTemplateChange,
}: MessageTemplateSectionProps) => {
  return (
    <div className="p-5 card">
      <h6 className="text-xl font-semibold text-primary mb-2">
        문자 템플릿 선택
      </h6>

      <Select
        fullWidth
        value={selectedTemplate}
        onChange={onTemplateChange}
        disabled={isLoading}
        emptyText="템플릿을 선택해주세요"
        className="mb-4"
      >
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          Object.entries(groupedTemplates).map(
            ([category, categoryTemplates]) => [
              <div
                key={category}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50"
              >
                {category}
              </div>,
              ...categoryTemplates.map((template) => (
                <MenuItem
                  key={template.uid}
                  value={template.uid}
                  className="pl-8"
                >
                  {template.name}
                </MenuItem>
              )),
            ]
          )
        )}
      </Select>
      <TextField
        disabled
        fullWidth
        multiline
        rows={10}
        value={messageContent}
        onChange={() => {}}
      />
    </div>
  );
};

export default MessageTemplateSection;
