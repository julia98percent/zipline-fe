import { Stack, Typography, Divider } from "@mui/material";
import { MessageHistory } from "@ts/message";

function MessageStatistics({
  messageHistory,
}: {
  messageHistory: MessageHistory;
}) {
  const stats = [
    { label: "총 접수", value: messageHistory.count.sentTotal },
    { label: "성공", value: messageHistory.count.sentSuccess },
    { label: "실패", value: messageHistory.count.sentFailed },
  ];

  return (
    <>
      <Stack direction="row" spacing={2} className="grid grid-flow-col">
        {stats.map(({ label, value }) => (
          <Stack key={label} spacing={1} className="items-center">
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2">{value}</Typography>
          </Stack>
        ))}
      </Stack>
      <Divider />
    </>
  );
}

export default MessageStatistics;
