import Button from "@components/Button";
import Divider from "@mui/material/Divider";

interface CustomerActionButtonsProps {
  isEditing: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDeleteClick: () => void;
}

const CustomerActionButtons = ({
  isEditing,
  onEditClick,
  onCancelEdit,
  onSaveEdit,
  onDeleteClick,
}: CustomerActionButtonsProps) => {
  return (
    <div className="flex justify-end">
      {isEditing ? (
        <div className="flex items-center justify-end gap-1">
          <Button variant="text" color="info" onClick={onCancelEdit}>
            취소
          </Button>
          <Divider orientation="vertical" className="h-4 bg-neutral-300" />
          <Button variant="text" color="primary" onClick={onSaveEdit}>
            저장
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-1">
          <Button variant="text" color="info" onClick={onEditClick}>
            수정
          </Button>
          <Divider orientation="vertical" className="h-4 bg-neutral-300" />
          <Button variant="text" color="error" onClick={onDeleteClick}>
            삭제
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerActionButtons;
