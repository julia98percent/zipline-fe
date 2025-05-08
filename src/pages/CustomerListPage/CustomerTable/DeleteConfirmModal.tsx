import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  customerName,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>고객 삭제</DialogTitle>
      <DialogContent>
        <Typography>{customerName} 고객을 정말 삭제하시겠습니까?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          삭제된 데이터는 복구할 수 없습니다.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
