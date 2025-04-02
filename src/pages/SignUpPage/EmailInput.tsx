import TextField from "@components/TextField";

interface Props {
  email: string;
  handleChangeEmail: React.ChangeEventHandler<HTMLInputElement>;
}

const EmailInput = ({ email, handleChangeEmail }: Props) => {
  return (
    <TextField
      label="이메일 주소"
      placeholder="name@email.com"
      value={email}
      onChange={handleChangeEmail}
    />
  );
};

export default EmailInput;
