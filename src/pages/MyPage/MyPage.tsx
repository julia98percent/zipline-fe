import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Button from "@components/Button";
import useUserStore from "@stores/useUserStore";
import apiClient from "@apis/apiClient";

function MyPage() {
  const triggerCrawler = () => {
    apiClient
      .get("/admin/crawl/region")
      .then(() => console.log("region 크롤링 완료"));
  };

  const { user } = useUserStore();
  return (
    <Box sx={{ padding: "32px" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, minWidth: "max-content", display: "inline", margin: 0 }}
      >
        마이페이지
      </Typography>
      {/* <Box>
        <Typography>내 정보</Typography>
        <Button text="비밀번호 변경" />
      </Box> */}

      <Box sx={{ marginTop: 4 }}>
        <Typography sx={{ marginBottom: 1 }}>내 설문</Typography>
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
      {user?.role == "ROLE_ADMIN" && (
        <Box>
          <Button text="크롤링 트리거 버튼" onClick={triggerCrawler} />
        </Box>
      )}
    </Box>
  );
}

export default MyPage;
