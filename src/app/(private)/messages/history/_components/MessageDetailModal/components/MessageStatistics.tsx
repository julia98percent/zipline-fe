import { Stack, Typography, Divider } from "@mui/material";
import { MessageHistory } from "@/types/message";

function MessageStatistics({
  messageHistory,
}: {
  messageHistory: MessageHistory;
}) {
  const stats = [
    {
      label: "총 접수",
      value: messageHistory.count.sentTotal,
      color: "black",
    },
    { label: "성공", value: messageHistory.count.sentSuccess, color: "blue" },
    { label: "실패", value: messageHistory.count.sentFailed, color: "red" },
  ];

  return (
    <>
      <Stack direction="row" spacing={2} className="grid grid-flow-col">
        {stats.map(({ label, value, color }) => (
          <Stack key={label} spacing={1} className="items-center">
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2" className="font-semibold" color={color}>
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Divider />
    </>
  );
}

export default MessageStatistics;
