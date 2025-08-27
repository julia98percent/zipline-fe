import { Stack } from "@mui/material";
import { MessageHistory } from "@ts/message";
import { formatDate } from "@utils/dateUtil";

function MessageLog({ messageHistory }: { messageHistory: MessageHistory }) {
  return (
    <div className="p-2">
      <h6 className="text-center font-medium">문자 발송 로그</h6>
      <Stack spacing={1}>
        {messageHistory.log.map((log, index) => (
          <div
            key={index}
            className="text-sm font-normal p-2 border-b border-neutral-300"
          >
            <p>{log.message}</p>
            <span className="text-neutral-500">{formatDate(log.createAt)}</span>
          </div>
        ))}
      </Stack>
    </div>
  );
}

export default MessageLog;
