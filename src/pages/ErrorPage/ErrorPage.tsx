import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button";

function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // 홈 페이지로 리다이렉트
  };

  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <Typography variant="h4" className="mb-4">
        404: 페이지를 찾을 수 없습니다
      </Typography>
      <Typography variant="body1" className="mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </Typography>
      <Button
        onClick={handleGoHome}
        className="bg-[#164F9E] text-white hover:bg-[#0D3B7A] px-3 py-1 rounded"
      >
        홈으로 돌아가기
      </Button>
    </Box>
  );
}

export default ErrorPage;
