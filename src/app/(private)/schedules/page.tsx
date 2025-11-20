import { Metadata } from "next";
import ScheduleContainer from "./_components/ScheduleContainer";

export const metadata: Metadata = {
  title: "일정 관리",
  description: "일정 및 스케줄 관리",
};

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return <ScheduleContainer />;
}
