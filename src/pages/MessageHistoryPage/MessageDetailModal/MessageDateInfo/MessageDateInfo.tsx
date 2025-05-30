import { Stack, Typography, Divider } from "@mui/material";
import { MessageHistory } from "@ts/Message";
import { formatDate } from "@utils/dateUtil";

function MessageDateInfo({
  messageHistory,
}: {
  messageHistory: MessageHistory;
}) {
  const dateInfo = [
    {
      label: "발송 요청",
      value: formatDate(messageHistory.dateSent),
    },
    {
      label: "처리 완료",
      value: formatDate(messageHistory.dateCompleted),
    },
  ];

  return (
    <>
      <Stack sx={{ display: "grid", gridAutoFlow: "column" }}>
        {dateInfo.map(({ label, value }) => (
          <Stack key={label} sx={{ alignItems: "center" }} spacing={1}>
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
