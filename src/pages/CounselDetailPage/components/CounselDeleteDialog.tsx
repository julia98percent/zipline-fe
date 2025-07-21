import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import Button from "@components/Button";

interface CounselDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CounselDeleteDialog = ({
  open,
  onClose,
  onConfirm,
}: CounselDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>상담 삭제</DialogTitle>
      <DialogContent>
        <Typography>정말로 상담을 삭제하시겠습니까?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onConfirm} color="error">
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CounselDeleteDialog;
