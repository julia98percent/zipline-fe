import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "@/components/Button";

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
  const defaultMessage = `이 ${category} 정보를 영구적으로 삭제하시겠습니까?`;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        className: "min-w-[320px] w-[40vw] md:w-[30vw] rounded-lg",
      }}
    >
      <DialogTitle className="flex justify-between items-center">
        {title || defaultTitle}
      </DialogTitle>

      <DialogContent className="m-auto pb-4">
        <span>{message || defaultMessage}</span>
      </DialogContent>

      <DialogActions className="flex justify-center mb-4">
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
          color="info"
          className="min-w-[100px]"
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
