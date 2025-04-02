import TextField from "@components/TextField";

interface Props {
  phoneNumber: string;
  handleChangePhoneNumber: React.ChangeEventHandler<HTMLInputElement>;
}

const PhoneNumberInput = ({ phoneNumber, handleChangePhoneNumber }: Props) => {
  return (
    <TextField
      label="전화번호"
      type="tel"
      placeholder="010-1234-5678"
      className="mb-4"
      value={phoneNumber}
      onChange={handleChangePhoneNumber}
    />
  );
};

export default PhoneNumberInput;
