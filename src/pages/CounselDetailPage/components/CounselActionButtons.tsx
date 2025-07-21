import Button from "@components/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

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
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {!isEditing ? (
        <>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={onDeleteClick}
          >
            삭제
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CloseIcon />}
            onClick={onCancelEdit}
          >
            취소
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
          >
            저장
          </Button>
        </>
      )}
    </div>
  );
};

export default CounselActionButtons;
