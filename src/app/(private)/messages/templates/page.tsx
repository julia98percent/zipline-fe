import { Metadata } from "next";
import { fetchMessageTemplates } from "@/apis/messageService";
import MessageTemplateContainer from "./_components/MessageTemplateContainer";

export const metadata: Metadata = {
  title: "메시지 템플릿 관리",
  description: "메시지 템플릿 생성 및 관리",
};

export const dynamic = "force-dynamic";

export default async function MessageTemplatePage() {
  const templates = await fetchMessageTemplates();

  return <MessageTemplateContainer initialTemplates={templates} />;
}
