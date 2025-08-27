import { TextareaAutosize as TextArea } from "@mui/material";

interface CounselDetailsContentProps {
  content: string;
  isEditing: boolean;
  onDetailChange: (value: string) => void;
}

const CounselDetailsContent = ({
  content,
  isEditing,
  onDetailChange,
}: CounselDetailsContentProps) => {
  return (
    <div className="p-5 card">
      <h6 className="text-lg font-semibold text-primary mb-2">상담 내용</h6>
      <div className="flex flex-col gap-4">
        {isEditing ? (
          <TextArea
            minRows={3}
            className="resize-none border border-gray-300 rounded-md p-2"
            value={content}
            onChange={(e) => onDetailChange(e.target.value)}
          />
        ) : (
          <p className="font-medium">{content}</p>
        )}
      </div>
    </div>
  );
};

export default CounselDetailsContent;
