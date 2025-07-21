import Button from "@components/Button";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onModalOpen: () => void;
}

const CounselActionButtons = ({ onModalOpen }: Props) => {
  return (
    <Button
      variant="contained"
      onClick={onModalOpen}
      className="bg-[#164F9E] shadow-none hover:bg-[#0D3B7A] hover:shadow-none h-9 text-xs px-4 flex items-center gap-2"
    >
      <AddIcon fontSize="small" />
      상담 등록
    </Button>
  );
};

export default CounselActionButtons;
