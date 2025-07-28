import { Box, Typography } from "@mui/material";

function SubmitSurveySuccessPage() {
  return (
    <Box className="flex flex-col items-center justify-center h-screen bg-[#f9f9f9] text-center">
      <Typography variant="h5" className="mb-4">
        설문을 정상적으로 제출했습니다.
      </Typography>
      <Typography variant="body1" className="mb-8">
        시간 내어주신 만큼 고객 여러분의 필요를 채워드릴수 있는 중개사가 되도록
        노력하겠습니다. 🙂
      </Typography>
    </Box>
  );
}

export default SubmitSurveySuccessPage;
