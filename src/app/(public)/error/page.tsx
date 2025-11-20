import { Metadata } from "next";
import GoHomeButton from "./_components/GoHomeButton";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "404 - 요청하신 페이지가 존재하지 않습니다",
};

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-100 text-center">
      <h4 className="mb-4">404: 페이지를 찾을 수 없습니다.</h4>
      <p className="mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <GoHomeButton />
    </div>
  );
}
