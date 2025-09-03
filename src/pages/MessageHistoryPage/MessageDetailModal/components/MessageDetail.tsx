import { useState } from "react";
import { Typography, Stack, IconButton } from "@mui/material";
import { MessageDetail as MessageDetailType } from "@ts/message";
import { getStatusMessage, getErrorMessage } from "@utils/messageUtil";
import { formatDate } from "@utils/dateUtil";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import InfoField from "@components/InfoField";

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
      <div className="p-4 w-[300px] max-w-full">
        <Stack spacing={1}>
          {messageList.length > 0 && (
            <>
              <InfoField
                label="발신번호"
                value={messageList[currentIndex].from}
              />

              <InfoField
                label="수신번호"
                value={messageList[currentIndex].to}
              />

              <InfoField
                label="메시지 내용"
                value={messageList[currentIndex].text}
              />

              <InfoField
                label="상태"
                value={` ${getStatusMessage(
                  messageList[currentIndex].statusCode
                )} - ${getErrorMessage(messageList[currentIndex].statusCode)}`}
              />

              <p className="text-sm text-neutral-500">
                발송일시: {formatDate(messageList[currentIndex].dateCreated)}
              </p>
            </>
          )}
        </Stack>
      </div>

      <div className="flex justify-between items-center">
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
      </div>
    </>
  );
}

export default MessageDetail;
