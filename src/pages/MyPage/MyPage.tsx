import { Link } from "react-router-dom";
import Button from "@components/Button";
import { Box, Typography } from "@mui/material";

function MyPage() {
  const survey = {
    name: "신규 회원 전용 설문",
    createdAt: Date.now(),
    questions: [
      {
        title: "문항제목", //필수
        description: "문항 설명", // 필수
        type: "MULTIPLE_CHOICE", // (MULTIPLE_CHOICE, SINGLE_CHOICE, SUBJECTIVE, FILE_UPLOAD) 필수
        isRequired: false, // 필수
        choices: [
          // 선택지 (주관식 및 파일업로드 문항인데 있으면 에러 반환)
          { content: "빨강" }, // 선택지 명(필수)
          { content: "파랑" },
          { content: "초록" },
        ],
      },
      {
        title: "title",
        description: "당신의 취미는 무엇인가요?",
        isRequired: false,
        type: "SUBJECTIVE",
      },
    ],
  };

  return (
    <div>
      <Box>
        <Typography>내 정보</Typography>
        <Button text="비밀번호 변경" />
      </Box>

      <Box>
        <Typography>내 설문</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 3,
            backgroundColor: "#f9f9f9",
          }}
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {survey.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              생성일: {new Date(survey.createdAt).toLocaleDateString()}
            </Typography>
          </div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Link to="edit-survey">
              <Button
                text="수정"
                color="primary"
                sx={{
                  backgroundColor: "#2E5D9F",
                  color: "white",
                }}
              />
            </Link>
          </Box>
        </Box>
      </Box>

      <Box>
        <Button text="회원 탈퇴" />
      </Box>
    </div>
  );
}

export default MyPage;
