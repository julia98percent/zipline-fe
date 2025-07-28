import { Box, Typography, Stack } from "@mui/material";
import { MessageHistory } from "@ts/message";
import { formatDate } from "@utils/dateUtil";

function MessageLog({ messageHistory }: { messageHistory: MessageHistory }) {
  return (
    <Box className="bg-neutral-100 p-2">
      <Typography className="font-medium">문자 발송 로그</Typography>
      <Stack spacing={1}>
        {messageHistory.log.map((log, index) => (
          <Box key={index} className="p-2 border-b border-neutral-300">
            <Typography variant="body2">{log.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(log.createAt)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default MessageLog;
