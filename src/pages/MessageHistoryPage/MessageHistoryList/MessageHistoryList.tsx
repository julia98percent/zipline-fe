import { useEffect, useRef, useCallback } from "react";
import MessageHistoryListView from "./MessageHistoryListView";
import { CircularProgress, Typography } from "@mui/material";
import MessageHistoryCard from "./MessageHistoryCard";
import { MessageHistory } from "@ts/message";

interface Props {
  messageList: MessageHistory[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  handleRowClick: (rowData: MessageHistory) => void;
  handleCardClick: (groupId: string) => void;
}

const MessageHistoryList = ({
  messageList,
  hasMore,
  isLoading,
  loadMore,
  handleRowClick,
  handleCardClick,
}: Props) => {
  console.log(messageList);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleIntersection]);

  return (
    <div ref={scrollRef} className="w-full">
      <div className="hidden lg:block">
        <MessageHistoryListView
          messageList={messageList}
          onRowClick={handleRowClick}
        />
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        {messageList.map((message, index) => (
          <MessageHistoryCard
            key={`${message.groupId}-${index}`}
            message={message}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-[20px]">
          <CircularProgress size={24} />
          <Typography variant="body2" className="ml-4">
            문자 발송 내역을 불러오는 중...
          </Typography>
        </div>
      )}

      {hasMore && !isLoading && (
        <div
          ref={sentinelRef}
          style={{
            height: "20px",
            width: "100%",
            backgroundColor: "transparent",
          }}
        />
      )}

      {!hasMore && messageList.length > 0 && (
        <div className="flex justify-center p-4 text-primary">
          <Typography variant="body2">
            모든 문자 발송 내역을 불러왔습니다.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default MessageHistoryList;
