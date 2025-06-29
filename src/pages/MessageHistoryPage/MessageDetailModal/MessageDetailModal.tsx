import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { translateMessageStatusToKorean } from "@utils/messageUtil";
import { fetchMessageList } from "@apis/messageService";
import { useEffect, useState } from "react";

import MessageStatistics from "./MessageStatistics";
import MessageDateInfo from "./MessageDateInfo";
import MessageLog from "./MessageLog";
import MessageDetail from "./MessageDetail/MessageDetail";
import { MessageHistory } from "@ts/message";

interface Props {
  open: boolean;
  onClose: () => void;
  messageHistory: MessageHistory;
}

function MessageDetailModal({ open, onClose, messageHistory }: Props) {
  const [messageList, setMessageList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchMessageList(messageHistory.groupId);

      setMessageList(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch message list:", error);
      return [];
    }
  };

  useEffect(() => {
    if (messageHistory?.groupId) {
      fetchData();
    }
  }, [messageHistory?.groupId]);

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
          }}
        >
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          padding: "20px 24px 0 24px",
        }}
      >
        <DialogTitle sx={{ padding: 0 }}>문자 발송 내역 상세</DialogTitle>
        <IconButton onClick={onClose}>
          <Clear />
        </IconButton>
      </Box>

      <DialogContent sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Stack spacing={2}>
          <Box className="flex flex-col items-center">
            <Typography variant="subtitle1" fontWeight="semi-bold">
              문자 발송 요청 상태
            </Typography>
            <Typography color="primary">
              {translateMessageStatusToKorean(messageHistory?.status)}
            </Typography>
          </Box>
          <Divider />
          <MessageStatistics messageHistory={messageHistory} />
          <MessageDateInfo messageHistory={messageHistory} />
          <MessageLog messageHistory={messageHistory} />
        </Stack>
        <Stack
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="semi-bold">
            발송 요청 문자 목록
          </Typography>

          <MessageDetail messageList={messageList} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default MessageDetailModal;
