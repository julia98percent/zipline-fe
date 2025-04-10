import { Box, Typography, Button } from "@mui/material";

function SubmitSurveySuccessPage() {
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
      <Typography variant="h5" sx={{ mb: 2 }}>
        설문을 정상적으로 제출했습니다.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        시간 내어주신 만큼 고객 여러분의 필요를 채워드릴수 있는 중개사가 되도록
        노력하겠습니다. 🙂
      </Typography>
    </Box>
  );
}

export default SubmitSurveySuccessPage;
