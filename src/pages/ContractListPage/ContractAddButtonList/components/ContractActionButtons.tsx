import Button from "@components/Button";

interface Props {
  handleSubmit: () => void;
  disabled?: boolean;
}

const ContractActionButtons = ({ handleSubmit, disabled = false }: Props) => {
  return (
    <Button
      text="등록"
      disabled={disabled}
      onClick={handleSubmit}
      sx={{
        mt: 2,
        color: "white !important",
        backgroundColor: "#164F9E",
        "&:disabled": { backgroundColor: "lightgray", color: "white" },
      }}
    />
  );
};

export default ContractActionButtons;
