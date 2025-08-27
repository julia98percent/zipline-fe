import { Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
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
        <div className="flex justify-center items-center p-6">
          <CircularProgress />
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "w-[90vw] rounded-lg max-h-[90vh]",
      }}
    >
      <DialogTitle className="font-semibold text-primary">
        문자 발송 내역 상세
      </DialogTitle>

      <DialogContent className="border-t border-gray-200 bg-neutral-100 flex flex-col sm:flex-row p-3 gap-4">
        <div className="flex flex-col card p-5 gap-2">
          <div className="flex flex-col items-center">
            <h6 className="font-medium mb-2">문자 발송 요청 상태</h6>
            <p className="font-semibold text-primary">
              {translateMessageStatusToKorean(messageHistory?.status)}
            </p>
          </div>
          <Divider />
          <MessageStatistics messageHistory={messageHistory} />
          <MessageDateInfo messageHistory={messageHistory} />
          <MessageLog messageHistory={messageHistory} />
        </div>
        <div className="p-3 flex-1 flex flex-col gap-4 card">
          <h6 className="text-center font-medium">발송 요청 문자 목록</h6>

          <MessageDetail messageList={messageList} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MessageDetailModal;
