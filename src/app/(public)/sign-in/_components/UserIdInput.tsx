import TextField from "@/components/TextField";

interface Props {
  userId: string;
  handleChangeUserId: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const UserIdInput = ({ userId, handleChangeUserId, onKeyDown }: Props) => {
  return (
    <TextField
      label="아이디"
      value={userId}
      onChange={handleChangeUserId}
      onKeyDown={onKeyDown}
    />
  );
};

export default UserIdInput;
