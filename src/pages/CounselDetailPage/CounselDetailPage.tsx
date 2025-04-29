import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  IconButton,
  Chip,
} from "@mui/material";
import PageHeader from "@components/PageHeader/PageHeader";
import useUserStore from "@stores/useUserStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@apis/apiClient";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const COUNSEL_TYPES = {
  PURCHASE: "매수",
  SALE: "매도",
  LEASE: "임대",
  RENT: "임차",
  OTHER: "기타",
} as const;

const COUNSEL_TYPE_COLORS = {
  매수: "#164F9E",
  매도: "#2E7D32",
  임대: "#D4A72C",
  임차: "#7B1FA2",
  기타: "#666666",
} as const;

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

interface CounselUpdateRequest {
  title: string;
  type: string;
  counselDate: string;
  dueDate: string;
  completed: boolean;
  counselDetails: Array<{
    question: string;
    answer: string;
  }>;
}

interface ErrorResponse {
  success: boolean;
  code: number;
  message: string;
}

function CounselDetailPage() {
  const { counselUid } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [counselData, setCounselData] = useState<CounselData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CounselData | null>(null);

  useEffect(() => {
    const fetchCounselData = async () => {
      try {
        const response = await apiClient.get(`/counsels/${counselUid}`);
        if (response.data.success) {
          setCounselData(response.data.data);
          setEditedData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch counsel data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselData();
  }, [counselUid]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(counselData);
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const updateData: CounselUpdateRequest = {
        title: editedData.title,
        type: editedData.type,
        counselDate: dayjs(editedData.counselDate).toISOString(),
        dueDate: dayjs(editedData.dueDate).format("YYYY-MM-DD"),
        completed: editedData.completed,
        counselDetails: editedData.counselDetails.map((detail) => ({
          question: detail.question,
          answer: detail.answer,
        })),
      };

      const response = await apiClient.put(
        `/counsels/${counselUid}`,
        updateData
      );
      if (response.data.success) {
        setCounselData(editedData);
        setIsEditing(false);
        toast.success("상담 내용을 수정했습니다.");
      }
    } catch (error) {
      console.error("Failed to update counsel:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "상담 내용 수정 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (
    field: keyof CounselData,
    value: string | boolean
  ) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  const handleDetailChange = (
    detailUid: number,
    field: keyof CounselDetail,
    value: string
  ) => {
    if (!editedData) return;
    const updatedDetails = editedData.counselDetails.map((detail) =>
      detail.counselDetailUid === detailUid
        ? { ...detail, [field]: value }
        : detail
    );
    setEditedData({ ...editedData, counselDetails: updatedDetails });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await apiClient.delete(`/counsels/${counselUid}`);
      if (response.data.success) {
        toast.success("상담이 성공적으로 삭제되었습니다.");
        navigate("/counsels", { replace: true });
      }
    } catch (error) {
      console.error("Failed to delete counsel:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "상담 삭제 중 오류가 발생했습니다.";
      toast.error(errorMessage);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddQuestion = () => {
    if (!editedData) return;

    const newQuestion = {
      counselDetailUid: Date.now(), // 임시 ID
      question: "",
      answer: "",
    };

    setEditedData({
      ...editedData,
      counselDetails: [...editedData.counselDetails, newQuestion],
    });
  };

  const handleRemoveQuestion = (counselDetailUid: number) => {
    if (!editedData) return;

    setEditedData({
      ...editedData,
      counselDetails: editedData.counselDetails.filter(
        (detail) => detail.counselDetailUid !== counselDetailUid
      ),
    });
  };

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

      {/* 수정/삭제 버튼 영역 */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        {isEditing ? (
          <>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                borderColor: "#2E7D32",
                color: "#2E7D32",
                "&:hover": {
                  borderColor: "#1B5E20",
                  backgroundColor: "rgba(46, 125, 50, 0.04)",
                },
              }}
            >
              저장
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCancelEdit}
              sx={{
                borderColor: "#666666",
                color: "#666666",
                "&:hover": {
                  borderColor: "#333333",
                  backgroundColor: "rgba(102, 102, 102, 0.04)",
                },
              }}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                borderColor: "#164F9E",
                color: "#164F9E",
                "&:hover": {
                  borderColor: "#0D3B7A",
                  backgroundColor: "rgba(22, 79, 158, 0.04)",
                },
              }}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeleteClick}
              sx={{
                borderColor: "#D32F2F",
                color: "#D32F2F",
                "&:hover": {
                  borderColor: "#B22A2A",
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              삭제
            </Button>
          </>
        )}
      </Box>

      <Box sx={{ p: 3, pt: 0 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : editedData ? (
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
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    제목
                  </Typography>
                  {isEditing ? (
                    <TextField
                      value={editedData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      size="small"
                      sx={{ mt: 1 }}
                      fullWidth
                    />
                  ) : (
                    <Typography variant="body1">{editedData.title}</Typography>
                  )}
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    상담 유형
                  </Typography>
                  {isEditing ? (
                    <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                      <Select
                        value={editedData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                      >
                        {Object.entries(COUNSEL_TYPES).map(([key, value]) => (
                          <MenuItem key={key} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={editedData.type}
                        sx={{
                          backgroundColor:
                            COUNSEL_TYPE_COLORS[
                              editedData.type as keyof typeof COUNSEL_TYPE_COLORS
                            ] + "1A", // 10% opacity
                          color:
                            COUNSEL_TYPE_COLORS[
                              editedData.type as keyof typeof COUNSEL_TYPE_COLORS
                            ],
                          fontWeight: 600,
                          "& .MuiChip-label": {
                            px: 1.5,
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    매물
                  </Typography>
                  <Typography variant="body1">
                    {editedData.propertyUid
                      ? `매물 ${editedData.propertyUid}`
                      : "-"}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    상담일
                  </Typography>
                  {isEditing ? (
                    <TextField
                      type="datetime-local"
                      value={dayjs(editedData.counselDate).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      onChange={(e) =>
                        handleInputChange("counselDate", e.target.value)
                      }
                      size="small"
                      sx={{ mt: 1 }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {dayjs(editedData.counselDate).format("YYYY-MM-DD HH:mm")}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    의뢰 마감일
                  </Typography>
                  {isEditing ? (
                    <TextField
                      type="date"
                      value={dayjs(editedData.dueDate).format("YYYY-MM-DD")}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      size="small"
                      sx={{ mt: 1 }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {dayjs(editedData.dueDate).format("YYYY-MM-DD")}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: isEditing ? 1 : 1 }}
                  >
                    의뢰 완료 여부
                  </Typography>
                  {isEditing ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editedData.completed}
                          onChange={(e) =>
                            handleInputChange("completed", e.target.checked)
                          }
                          sx={{
                            color: "#164F9E",
                            "&.Mui-checked": {
                              color: "#164F9E",
                            },
                          }}
                        />
                      }
                      label="완료"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        color: editedData.completed ? "#219653" : "#F2994A",
                        backgroundColor: editedData.completed
                          ? "#E9F7EF"
                          : "#FEF5EB",
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        display: "inline-block",
                      }}
                    >
                      {editedData.completed ? "완료" : "진행중"}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* 문항 추가 버튼 */}
            {isEditing && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                  sx={{
                    borderColor: "#164F9E",
                    color: "#164F9E",
                    "&:hover": {
                      borderColor: "#0D3B7A",
                      backgroundColor: "rgba(22, 79, 158, 0.04)",
                    },
                  }}
                >
                  문항 추가
                </Button>
              </Box>
            )}

            {/* 문항별 응답 */}
            {editedData.counselDetails.map((detail, index) => (
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
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#EBF2FC",
                      color: "#164F9E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mr: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      value={detail.question}
                      onChange={(e) =>
                        handleDetailChange(
                          detail.counselDetailUid,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="질문을 입력하세요"
                      size="small"
                      sx={{
                        flexGrow: 1,
                        maxWidth: "calc(100% - 120px)", // 번호(40px) + 우측 여백(20px) + 삭제 버튼 영역(60px)
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "calc(100% - 120px)",
                      }}
                    >
                      {detail.question || `문항 ${index + 1}`}
                    </Typography>
                  )}
                  {isEditing && (
                    <IconButton
                      onClick={() =>
                        handleRemoveQuestion(detail.counselDetailUid)
                      }
                      disabled={editedData.counselDetails.length <= 1}
                      sx={{
                        color:
                          editedData.counselDetails.length <= 1
                            ? "#A0A0A0"
                            : "#D32F2F",
                        "&:hover": {
                          backgroundColor:
                            editedData.counselDetails.length <= 1
                              ? "transparent"
                              : "rgba(211, 47, 47, 0.04)",
                        },
                        "&.Mui-disabled": {
                          color: "#A0A0A0",
                        },
                        ml: 1,
                        width: 40,
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ ml: 6 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      ml: 1,
                    }}
                  >
                    답변
                  </Typography>
                  {isEditing ? (
                    <TextField
                      multiline
                      rows={5}
                      value={detail.answer}
                      onChange={(e) =>
                        handleDetailChange(
                          detail.counselDetailUid,
                          "answer",
                          e.target.value
                        )
                      }
                      placeholder="답변을 입력하세요"
                      size="small"
                      sx={{
                        width: "calc(100% - 80px)",
                        ml: 1,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        width: "calc(100% - 80px)",
                        whiteSpace: "pre-wrap",
                        ml: 1,
                      }}
                    >
                      {detail.answer}
                    </Typography>
                  )}
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

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            상담 삭제
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography>
            정말 이 상담을 삭제하시겠습니까?
            <br />
            삭제된 상담은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderColor: "#666666",
              color: "#666666",
              "&:hover": {
                borderColor: "#333333",
                backgroundColor: "rgba(102, 102, 102, 0.04)",
              },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#D32F2F",
              "&:hover": {
                backgroundColor: "#B22A2A",
              },
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CounselDetailPage;
