import { useState } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { MessageDetail as MessageDetailType } from "@ts/message";
import { getStatusMessage, getErrorMessage } from "@utils/messageUtil";
import { formatDate } from "@utils/dateUtil";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

function MessageDetail({ messageList }: { messageList: MessageDetailType[] }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(messageList.length - 1, prev + 1));
  };

  return (
    <>
      <Box className="p-4 bg-white rounded-lg shadow-md">
        <Stack spacing={1}>
          {messageList.length > 0 && (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  발신번호
                </Typography>
                <Typography variant="body2">
                  {messageList[currentIndex].from}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  수신번호
                </Typography>
                <Typography variant="body2">
                  {messageList[currentIndex].to}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  메시지 내용
                </Typography>
                <Typography variant="body2">
                  {messageList[currentIndex].text}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  상태
                </Typography>
                <Typography variant="body2">
                  {getStatusMessage(messageList[currentIndex].statusCode)}
                  {" - "}
                  {getErrorMessage(messageList[currentIndex].statusCode)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                발송일시: {formatDate(messageList[currentIndex].dateCreated)}
              </Typography>
            </>
          )}
        </Stack>
      </Box>
      <Box className="flex justify-between items-center">
        <IconButton onClick={handlePrevious} disabled={currentIndex === 0}>
          <NavigateBefore />
        </IconButton>

        <Typography variant="body2">
          {currentIndex + 1} / {messageList.length}
        </Typography>
        <IconButton
          onClick={handleNext}
          disabled={currentIndex === messageList.length - 1}
        >
          <NavigateNext />
        </IconButton>
      </Box>
    </>
  );
}

export default MessageDetail;
