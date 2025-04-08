import TextField from "@components/TextField";

interface Props {
  password: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordInput = ({ password, handleChangePassword }: Props) => {
  return (
    <TextField
      label="비밀번호"
      type="password"
      value={password}
      onChange={handleChangePassword}
    />
  );
};

export default PasswordInput;
