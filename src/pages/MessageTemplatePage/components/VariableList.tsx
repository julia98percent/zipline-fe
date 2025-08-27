import { List, ListItem, ListItemText } from "@mui/material";
import { AllowedVariable } from "@ts/message";
import AddIcon from "@mui/icons-material/Add";

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
    <div className="p-5 card">
      <h6 className="text-lg font-semibold text-primary mb-2">변수 목록</h6>
      <List className="py-0">
        {VARIABLE_LIST.map((variable) => (
          <ListItem
            key={variable.key}
            className="px-3 py-1 cursor-pointer rounded-md transition-all duration-200 mb-1"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-800 font-medium">
                      {variable.label}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {`{{${variable.key}}}`}
                    </span>
                  </div>
                  <AddIcon className="bg-primary-light text-white text-sm rounded" />
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
      <div className="bg-gray-50 p-4 rounded border border-gray-300">
        <p className="text-sm text-neutral-800 mb-2">
          ✔️ 변수는 반드시 <b>{"{{변수명}}"}</b> 형태로만 입력해 주세요.
          <br />
          (예: {"{{이름}}"}, {"{{생년월일}}"}, {"{{관심지역}}"})
        </p>
      </div>
    </div>
  );
};

export default VariableList;
