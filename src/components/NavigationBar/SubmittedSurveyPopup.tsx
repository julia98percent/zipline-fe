import { useState, MouseEvent } from "react";
import {
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Pagination,
  Divider,
  Box,
  Badge,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  fetchSubmittedSurveyResponses,
  SurveyResponse,
} from "@apis/preCounselService";

function SubmittedSurveyPopup() {
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<SurveyResponse[] | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // 한 페이지당 표시할 알림 수

  const notificationsOpen = Boolean(notificationsAnchorEl);

  const handleNotificationsClick = (e: MouseEvent<HTMLButtonElement>) => {
    fetchSubmittedSurveyList(1); // 팝업 열 때 첫 페이지 데이터 로드
    setNotificationsAnchorEl(e.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchSubmittedSurveyList(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const fetchSubmittedSurveyList = async (pageNumber: number) => {
    setLoading(true);
    try {
      const responseData = await fetchSubmittedSurveyResponses(
        pageNumber,
        itemsPerPage
      );

      if (responseData?.surveyResponses) {
        setNotifications(responseData.surveyResponses);
        setTotalPages(responseData.totalPages);
        setPage(responseData.currentPage);
        setTotalItems(responseData.totalItems);
      }
    } catch (error) {
      console.error("Failed to fetch submitted survey list:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleNotificationsClick}>
        <Badge badgeContent={totalItems > 0 ? totalItems : null} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <div>
        <Menu
          anchorEl={notificationsAnchorEl}
          open={notificationsOpen}
          onClose={handleNotificationsClose}
          PaperProps={{
            style: {
              maxHeight: 400,
              width: "320px",
            },
            elevation: 3,
          }}
        >
          <Box
            sx={{
              py: 1,
              px: 2,
              bgcolor: "#f5f5f5",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              제출된 설문
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 6,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : notifications && notifications.length > 0 ? (
            <div>
              <Box sx={{ maxHeight: 280, overflow: "auto" }}>
                {notifications.map((notification, index) => (
                  <Box key={notification.surveyResponseUid}>
                    <MenuItem
                      sx={{
                        display: "block",
                        py: 1.5,
                        px: 2,
                        cursor: "default",
                        "&:hover": {
                          bgcolor: "#f9f9f9",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        제출일: {formatDate(notification.submittedAt)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#164F9E",
                        }}
                      >
                        {notification.name}님 / {notification.phoneNumber}
                      </Typography>
                    </MenuItem>
                    {index < notifications.length - 1 && (
                      <Divider sx={{ my: 0 }} />
                    )}
                  </Box>
                ))}
              </Box>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 1.5,
                  bgcolor: "#f9f9f9",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  size="small"
                  color="primary"
                  shape="rounded"
                  siblingCount={0}
                />
              </Box>
            </div>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                알림이 없습니다.
              </Typography>
            </Box>
          )}
        </Menu>
      </div>
    </>
  );
}

export default SubmittedSurveyPopup;
