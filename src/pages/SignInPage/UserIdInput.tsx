import TextField from "@components/TextField";

interface Props {
  userId: string;
  handleChangeUserId: React.ChangeEventHandler<HTMLInputElement>;
}

const UserIdInput = ({ userId, handleChangeUserId }: Props) => {
  return (
    <TextField label="아이디" value={userId} onChange={handleChangeUserId} />
  );
};

export default UserIdInput;
