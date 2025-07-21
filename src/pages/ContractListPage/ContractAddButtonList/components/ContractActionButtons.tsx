import Button from "@components/Button";

interface Props {
  handleSubmit: () => void;
  disabled?: boolean;
}

const ContractActionButtons = ({ handleSubmit, disabled = false }: Props) => {
  return (
    <Button
      disabled={disabled}
      onClick={handleSubmit}
      className="mt-4 text-white bg-[#164F9E] disabled:bg-gray-400 disabled:text-white"
    >
      등록
    </Button>
  );
};

export default ContractActionButtons;
