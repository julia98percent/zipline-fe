import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Button from "@components/Button";

function MyPage() {
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
              {/* {user.survey.name} */}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {/* 생성일: {user.survey.createdAt} */}
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
