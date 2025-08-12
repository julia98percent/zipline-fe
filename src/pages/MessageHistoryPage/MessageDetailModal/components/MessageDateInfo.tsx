import { Stack, Typography, Divider } from "@mui/material";
import { MessageHistory } from "@ts/message";
import { formatDate } from "@utils/dateUtil";

function MessageDateInfo({
  messageHistory,
}: {
  messageHistory: MessageHistory;
}) {
  const dateInfo = [
    {
      label: "발송 요청",
      value: messageHistory.dateSent
        ? formatDate(messageHistory.dateSent)
        : "-",
    },
    {
      label: "처리 완료",
      value: messageHistory.dateCompleted
        ? formatDate(messageHistory.dateCompleted)
        : "-",
    },
  ];

  return (
    <>
      <Stack className="grid grid-flow-col">
        {dateInfo.map(({ label, value }) => (
          <Stack key={label} className="items-center" spacing={1}>
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2">{value}</Typography>
          </Stack>
        ))}
      </Stack>
      <Divider />
    </>
  );
}
export default MessageDateInfo;
