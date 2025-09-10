import Button from "@/components/Button";

interface Props {
  handleSubmit: () => void;
  isSubmitButtonDisabled?: boolean;
  handleModalClose?: () => void;
}

const ContractActionButtons = ({
  handleSubmit,
  isSubmitButtonDisabled = false,
  handleModalClose,
}: Props) => {
  return (
    <div className="flex gap-2 ml-auto">
      <Button variant="outlined" color="info" onClick={handleModalClose}>
        취소
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={isSubmitButtonDisabled}
      >
        저장
      </Button>
    </div>
  );
};

export default ContractActionButtons;
