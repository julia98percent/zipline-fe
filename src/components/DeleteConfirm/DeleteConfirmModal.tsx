import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  
  interface DeleteConfirmModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  const DeleteConfirmModal = ({ open, onConfirm, onCancel }: DeleteConfirmModalProps) => {
    return (
        <Dialog
        open={open}
        onClose={onCancel}
        PaperProps={{
          sx: {
            width: "400px",       // 원하는 고정 너비
            maxWidth: "90%",      // 모바일 대응
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography fontWeight="bold">경고</Typography>
          <IconButton edge="end" onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent>
          <Typography textAlign="center" mt={1} mb={2}>
            정말 삭제하시겠습니까?
          </Typography>
        </DialogContent>
  
        <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            삭제
          </Button>
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default DeleteConfirmModal;
  