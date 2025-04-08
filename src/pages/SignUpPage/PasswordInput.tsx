import TextField from "@components/TextField";

interface Props {
  password: string;
  passwordCheck: string;
  handleChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  handleChangePasswordCheck: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordInput = ({
  password,
  passwordCheck,
  handleChangePassword,
  handleChangePasswordCheck,
}: Props) => {
  return (
    <>
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={handleChangePassword}
      />
      <TextField
        label="비밀번호 확인"
        type="password"
        value={passwordCheck}
        onChange={handleChangePasswordCheck}
      />
    </>
  );
};

export default PasswordInput;
