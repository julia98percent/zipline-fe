import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@components/Button";

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
    <Box className="flex justify-end mb-4">
      {isEditing ? (
        <div className="mt-4 flex gap-2">
          <Button
            variant="outlined"
            color="info"
            className="min-w-[83px]"
            onClick={onCancelEdit}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="min-w-[83px]"
            onClick={onSaveEdit}
          >
            저장
          </Button>
        </div>
      ) : (
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outlined"
            color="primary"
            onClick={onEditClick}
            startIcon={<EditIcon />}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onDeleteClick}
            startIcon={<DeleteIcon />}
          >
            삭제
          </Button>
        </div>
      )}
    </Box>
  );
};

export default CustomerActionButtons;
