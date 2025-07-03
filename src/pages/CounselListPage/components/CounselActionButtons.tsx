import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onModalOpen: () => void;
}

const CounselActionButtons = ({ onModalOpen }: Props) => {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onModalOpen}
      sx={{
        backgroundColor: "#164F9E",
        boxShadow: "none",
        "&:hover": { backgroundColor: "#0D3B7A", boxShadow: "none" },
        height: "36px",
        fontSize: "13px",
        padding: "0 16px",
      }}
    >
      상담 등록
    </Button>
  );
};

export default CounselActionButtons;
