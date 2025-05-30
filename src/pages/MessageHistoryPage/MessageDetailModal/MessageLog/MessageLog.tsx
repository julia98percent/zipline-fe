import { Box, Typography, Stack } from "@mui/material";
import { MessageHistory } from "@ts/Message";
import { formatDate } from "@utils/dateUtil";

function MessageLog({ messageHistory }: { messageHistory: MessageHistory }) {
  return (
    <Box className="bg-neutral-100 p-2">
      <Typography variant="subtitle1" fontWeight="bold">
        문자 발송 로그
      </Typography>
      <Stack spacing={1}>
        {messageHistory.log.map((log, index) => (
          <Box key={index} sx={{ p: 1, borderBottom: "1px solid #ddd" }}>
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
