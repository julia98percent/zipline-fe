import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@components/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  category: string;
  title?: string;
  message?: string;
  confirmText?: string;
  confirmColor?: "error" | "warning" | "primary";
}

const DeleteConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  category = "",
  title,
  message,
  confirmText = "삭제",
  confirmColor = "error",
}: DeleteConfirmModalProps) => {
  const defaultTitle = `${category} 삭제`;
  const defaultMessage = `이 ${category}을 정말 삭제할까요?`;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          width: "400px", // 원하는 고정 너비
          maxWidth: "90%", // 모바일 대응
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title || defaultTitle}
        </Typography>
        <IconButton edge="end" onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography textAlign="center" mt={1} mb={2}>
          {message || defaultMessage}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          className="min-w-[100px]"
        >
          {confirmText}
        </Button>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="primary"
          className="min-w-[100px]"
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
