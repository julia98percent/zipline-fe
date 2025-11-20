import { Metadata } from "next";
import EditSurveyContainer from "./_components/EditSurveyContainer";

export const metadata: Metadata = {
  title: "설문 수정",
  description: "사전 상담 설문 내용 수정",
};

export const dynamic = "force-dynamic";

export default function EditSurveyPage() {
  return <EditSurveyContainer />;
}
