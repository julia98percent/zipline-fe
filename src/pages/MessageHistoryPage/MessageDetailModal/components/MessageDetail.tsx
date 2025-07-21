import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { MessageDetail as MessageDetailType } from "@ts/message";
import { getStatusMessage, getErrorMessage } from "@utils/messageUtil";
import { formatDate } from "@utils/dateUtil";
import Button from "@components/Button";
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
      <Box
        sx={{
          padding: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<NavigateBefore />}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          이전
        </Button>
        <Typography variant="body2">
          {currentIndex + 1} / {messageList.length}
        </Typography>
        <Button
          endIcon={<NavigateNext />}
          onClick={handleNext}
          disabled={currentIndex === messageList.length - 1}
        >
          다음
        </Button>
      </Box>
    </>
  );
}

export default MessageDetail;
