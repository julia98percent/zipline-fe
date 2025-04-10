import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // 홈 페이지로 리다이렉트
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        404: 페이지를 찾을 수 없습니다
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </Typography>
      <Button
        onClick={handleGoHome}
        sx={{
          backgroundColor: "#2E5D9F",
          color: "white",
          px: 3,
          py: 1,
          borderRadius: "8px",
        }}
      >
        홈으로 돌아가기
      </Button>
    </Box>
  );
}

export default ErrorPage;
