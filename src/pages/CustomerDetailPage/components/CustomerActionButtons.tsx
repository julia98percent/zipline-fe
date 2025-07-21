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
        <div className="mt-4 flex">
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancelEdit}
            className="mr-2 bg-white min-w-[81px] hover:bg-gray-50"
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSaveEdit}
            className="shadow-none bg-[#164F9E] min-w-[81px] hover:bg-[#164F9E] hover:opacity-90 hover:shadow-none"
          >
            저장
          </Button>
        </div>
      ) : (
        <div className="flex justify-end mt-4">
          <Button
            variant="outlined"
            color="primary"
            onClick={onEditClick}
            className="mr-2 text-[#164F9E] min-h-[32px] ml-3 bg-white border-[#164F9E] hover:bg-blue-50 flex items-center gap-2"
          >
            <EditIcon fontSize="small" />
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onDeleteClick}
            className="bg-white border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <DeleteIcon fontSize="small" />
            삭제
          </Button>
        </div>
      )}
    </Box>
  );
};

export default CustomerActionButtons;
