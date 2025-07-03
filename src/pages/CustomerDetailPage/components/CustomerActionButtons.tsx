import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
      {isEditing ? (
        <div style={{ marginTop: "16px", display: "flex" }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancelEdit}
            sx={{
              mr: 1,
              backgroundColor: "white",
              minWidth: "81px",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSaveEdit}
            sx={{
              boxShadow: "none",
              backgroundColor: "#164F9E",
              minWidth: "81px",
              "&:hover": {
                backgroundColor: "#164F9E",
                opacity: 0.9,
                boxShadow: "none",
              },
            }}
          >
            저장
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEditClick}
            sx={{
              mr: 1,
              color: "#164F9E",
              minHeight: "32px",
              marginLeft: "12px",
              backgroundColor: "white",
            }}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDeleteClick}
            sx={{
              backgroundColor: "white",
            }}
          >
            삭제
          </Button>
        </div>
      )}
    </Box>
  );
};

export default CustomerActionButtons;
