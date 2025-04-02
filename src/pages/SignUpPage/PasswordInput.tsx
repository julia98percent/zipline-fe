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
        placeholder="1자 이상의 문자열"
        value={password}
        onChange={handleChangePassword}
      />
      <TextField
        placeholder="비밀번호 확인"
        value={passwordCheck}
        onChange={handleChangePasswordCheck}
      />
    </>
  );
};

export default PasswordInput;
