import { useNavigate } from "react-router-dom";
import Button from "@components/Button";

function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // 홈 페이지로 리다이렉트
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <h4 className="mb-4">404: 페이지를 찾을 수 없습니다.</h4>
      <p className="mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Button onClick={handleGoHome}>홈으로 돌아가기</Button>
    </div>
  );
}

export default ErrorPage;
