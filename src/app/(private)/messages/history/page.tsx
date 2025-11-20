import { Metadata } from "next";
import dayjs from "dayjs";
import { fetchMessages } from "@/apis/messageService";
import { buildDateFilterParams } from "@/utils/dateFilter";
import MessageHistoryContainer from "./_components/MessageHistoryContainer";

export const metadata: Metadata = {
  title: "메시지 발송 내역",
  description: "메시지 발송 이력 조회",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function MessageHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const startDate = params.startDate ? dayjs(params.startDate) : null;
  const endDate = params.endDate ? dayjs(params.endDate) : null;

  const dateParams = buildDateFilterParams(startDate, endDate);

  const response = await fetchMessages({
    ...dateParams,
    startKey: null,
  });

  const messages = response.groupList ? Object.values(response.groupList) : [];

  return (
    <MessageHistoryContainer
      initialMessages={messages}
      initialHasMore={response.nextKey !== null}
      initialCursorId={response.nextKey || null}
    />
  );
}
