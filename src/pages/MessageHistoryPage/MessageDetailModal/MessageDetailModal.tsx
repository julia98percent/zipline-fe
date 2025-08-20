import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { translateMessageStatusToKorean } from "@utils/messageUtil";
import { fetchMessageList } from "@apis/messageService";
import { useEffect, useState, useCallback } from "react";
import {
  MessageStatistics,
  MessageDateInfo,
  MessageLog,
  MessageDetail,
} from "./components";
import {
  MessageHistory,
  MessageDetail as MessageDetailType,
} from "@ts/message";
import CircularProgress from "@components/CircularProgress";

interface Props {
  open: boolean;
  onClose: () => void;
  messageHistory: MessageHistory | null;
}

function MessageDetailModal({ open, onClose, messageHistory }: Props) {
  const [messageList, setMessageList] = useState<MessageDetailType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (messageHistory) {
      try {
        setLoading(true);
        const response = await fetchMessageList(messageHistory.groupId);

        setMessageList(response);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
  }, [messageHistory]);

  useEffect(() => {
    if (messageHistory?.groupId) {
      fetchData();
    }
  }, [messageHistory?.groupId, fetchData]);

  if (!messageHistory) {
    return null;
  }

  if (loading) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: "80vw",
            borderRadius: 2,
          },
        }}
      >
        <Box className="flex justify-center items-center p-6">
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "80vw",
          borderRadius: 2,
        },
      }}
    >
      <Box className="flex justify-between items-center font-bold p-[20px_24px_0_24px]">
        <DialogTitle className="font-bold text-primary text-xl p-0">
          문자 발송 내역 상세
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </Box>

      <DialogContent className="flex flex-row gap-4">
        <Stack spacing={2}>
          <Box className="flex flex-col items-center">
            <Typography className="font-medium mb-2">
              문자 발송 요청 상태
            </Typography>
            <Typography color="primary" className="font-semibold">
              {translateMessageStatusToKorean(messageHistory?.status)}
            </Typography>
          </Box>
          <Divider />
          <MessageStatistics messageHistory={messageHistory} />
          <MessageDateInfo messageHistory={messageHistory} />
          <MessageLog messageHistory={messageHistory} />
        </Stack>
        <Stack className="flex-1 flex flex-col gap-4">
          <Typography className="font-medium">발송 요청 문자 목록</Typography>

          <MessageDetail messageList={messageList} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default MessageDetailModal;
