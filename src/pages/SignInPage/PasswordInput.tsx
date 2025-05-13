import TextField from "@components/TextField";

interface Props {
  password: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const PasswordInput = ({
  password,
  handleChangePassword,
  onKeyDown,
}: Props) => {
  return (
    <TextField
      label="비밀번호"
      type="password"
      value={password}
      onChange={handleChangePassword}
      onKeyDown={onKeyDown}
    />
  );
};

export default PasswordInput;
