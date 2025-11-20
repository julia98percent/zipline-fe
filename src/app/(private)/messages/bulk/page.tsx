import { Metadata } from "next";
import BulkMessageContainer from "./_components/BulkMessageContainer";

export const metadata: Metadata = {
  title: "대량 메시지 발송",
  description: "고객에게 메시지를 대량으로 발송",
};

export const dynamic = "force-dynamic";

export default function BulkMessagePage() {
  return <BulkMessageContainer />;
}
