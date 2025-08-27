import Button from "@components/Button";
import Divider from "@mui/material/Divider";

interface CounselActionButtonsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDeleteClick: () => void;
}

const CounselActionButtons = ({
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDeleteClick,
}: CounselActionButtonsProps) => {
  return (
    <div className="flex justify-end">
      {!isEditing ? (
        <div className="flex items-center">
          <Button variant="text" color="info" onClick={onEdit}>
            수정
          </Button>
          <Divider orientation="vertical" className="h-4 bg-neutral-300" />

          <Button variant="text" color="error" onClick={onDeleteClick}>
            삭제
          </Button>
        </div>
      ) : (
        <div className="flex items-center">
          <Button variant="text" color="info" onClick={onCancelEdit}>
            취소
          </Button>
          <Divider orientation="vertical" className="h-4 bg-neutral-300" />

          <Button variant="text" color="primary" onClick={onSave}>
            저장
          </Button>
        </div>
      )}
    </div>
  );
};

export default CounselActionButtons;
