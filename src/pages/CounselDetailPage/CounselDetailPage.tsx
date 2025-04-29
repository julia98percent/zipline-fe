import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";

interface CounselDetail {
  counselDetailUid: number;
  question: string;
  answer: string;
}

interface CounselData {
  counselUid: number;
  title: string;
  type: string;
  counselDate: string;
  dueDate: string;
  propertyUid: number;
  completed: boolean;
  counselDetails: CounselDetail[];
}

function CounselDetailPage() {
  const { counselUid } = useParams();
  const { user } = useUserStore();
  const [counselData, setCounselData] = useState<CounselData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(counselData);
  useEffect(() => {
    const fetchCounselData = async () => {
      try {
        const response = await apiClient.get(`/counsels/${counselUid}`);
        if (response.data.success) {
          setCounselData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch counsel data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselData();
  }, [counselUid]);

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="상담 상세" userName={user?.name || "-"} />

      <Box sx={{ p: 3 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : counselData ? (
          <>
            {/* 연관 정보 */}
            <Paper
              sx={{
                p: 3,
                mb: 2,
                borderRadius: "12px",
                boxShadow: "none",
                border: "1px solid #E0E0E0",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
              >
                연관 정보
              </Typography>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    제목
                  </Typography>
                  <Typography variant="body1">{counselData.title}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    상담
                  </Typography>
                  <Typography variant="body1">{counselData.type}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    매물
                  </Typography>
                  <Typography variant="body1">
                    {counselData.propertyUid
                      ? `매물 ${counselData.propertyUid}`
                      : "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    상담 예정일
                  </Typography>
                  <Typography variant="body1">
                    {dayjs(counselData.counselDate).format("YYYY-MM-DD")}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    의뢰 마감일
                  </Typography>
                  <Typography variant="body1">
                    {dayjs(counselData.dueDate).format("YYYY-MM-DD")}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* 문항별 응답 */}
            {counselData.counselDetails.map((detail, index) => (
              <Paper
                key={detail.counselDetailUid}
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: "12px",
                  boxShadow: "none",
                  border: "1px solid #E0E0E0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#EBF2FC",
                      color: "#164F9E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      mr: 2,
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    문항 {index + 1}
                  </Typography>
                </Box>

                <Box sx={{ ml: 6 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 1 }}
                  >
                    질문
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {detail.question}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 1 }}
                  >
                    답변
                  </Typography>
                  <Typography variant="body1">{detail.answer}</Typography>
                </Box>
              </Paper>
            ))}
          </>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            상담 정보를 찾을 수 없습니다.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default CounselDetailPage;
