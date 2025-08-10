import { Box } from "@mui/material";
import dayjs from "dayjs";
import { MessageHistory } from "@ts/message";
import { translateMessageStatusToKorean } from "@utils/messageUtil";

interface MessageHistoryCardProps {
  message: MessageHistory;
  onCardClick: (groupId: string) => void;
}

const MessageHistoryCard = ({
  message,
  onCardClick,
}: MessageHistoryCardProps) => {
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  const getStatusText = (status: string) => {
    const translated = translateMessageStatusToKorean(status);
    const emoji =
      status === "COMPLETE" ? "✅" : status === "FAILED" ? "❌" : "⏳";
    return `${emoji} ${translated}`;
  };

  return (
    <Box
      onClick={() => onCardClick(message.groupId)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      <Box className="space-y-3 text-sm">
        <Box className="flex">
          <Box className="w-20 text-gray-600 font-medium">요청일시</Box>
          <Box className="text-gray-900">{formatDate(message.dateCreated)}</Box>
        </Box>

        <Box className="flex">
          <Box className="w-20 text-gray-600 font-medium">상태</Box>
          <Box className="text-gray-900">{getStatusText(message.status)}</Box>
        </Box>

        <Box className="flex">
          <Box className="w-20 text-gray-600 font-medium">발송 완료일</Box>
          <Box className="text-gray-900">
            {message.dateCompleted ? formatDate(message.dateCompleted) : "-"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageHistoryCard;
