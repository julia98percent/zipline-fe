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
import styles from "./styles/CounselDetailPage.module.css";

const COUNSEL_TYPES = {
  PURCHASE: "매수",
  SALE: "매도",
  LEASE: "임대",
  RENT: "임차",
  OTHER: "기타",
} as const;

const PROPERTY_CATEGORIES = {
  ONE_ROOM: "원룸",
  TWO_ROOM: "투룸",
  APARTMENT: "아파트",
  VILLA: "빌라",
  HOUSE: "주택",
  OFFICETEL: "오피스텔",
  COMMERCIAL: "상가",
} as const;

type CounselType = keyof typeof COUNSEL_TYPES;
type PropertyCategory = keyof typeof PROPERTY_CATEGORIES;

interface CustomerInfo {
  uid: number;
  name: string;
  phoneNo: string;
  preferredRegion?: string;
  minPrice: number | null;
  maxPrice: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  minRent: number | null;
  maxRent: number | null;
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
}

interface PropertyInfo {
  address: string;
  type: string;
  price: number | null;
  deposit: number | null;
  monthlyRent: number | null;
  exclusiveArea: number;
  supplyArea: number;
  floor: number;
  constructionYear: string;
  hasElevator: boolean;
  parkingCapacity: number;
  hasPet: boolean;
  description?: string;
}

interface CounselDetail {
  counselDetailUid: number;
  question: string;
  answer: string;
}

interface CounselData {
  counselUid: number;
  title: string;
  type: CounselType;
  counselDate: string;
  dueDate: string;
  propertyUid: number;
  completed: boolean;
  counselDetails: CounselDetail[];
  customer: CustomerInfo;
  property?: PropertyInfo;
}

interface CounselUpdateRequest {
  title: string;
  type: CounselType;
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
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CounselData | null>(null);

  useEffect(() => {
    const fetchCounselData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/counsels/${counselUid}`);
        if (response.data.success && response.data.data.customer) {
          setCounselData(response.data.data);
          setEditedData(response.data.data);
        } else {
          throw new Error("응답 실패");
        }
      } catch (error) {
        console.error("Failed to fetch counsel data:", error);
        toast.error("상담 정보를 불러오는데 실패했습니다.");
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
    const newDetail: CounselDetail = {
      counselDetailUid: Date.now(),
      question: "",
      answer: "",
    };
    setEditedData({
      ...editedData,
      counselDetails: [...editedData.counselDetails, newDetail],
    });
  };

  const handleRemoveQuestion = (counselDetailUid: number) => {
    if (!editedData) return;
    if (editedData.counselDetails.length <= 1) return;
    setEditedData({
      ...editedData,
      counselDetails: editedData.counselDetails.filter(
        (detail) => detail.counselDetailUid !== counselDetailUid
      ),
    });
  };

  if (isLoading) {
    return (
      <Box className={styles.container}>
        <CircularProgress />
      </Box>
    );
  }

  if (!counselData || !editedData) {
    return (
      <Box className={styles.container}>
        <Typography>상담 정보를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const data = isEditing ? editedData : counselData;

  return (
    <Box className={styles.container}>
      <PageHeader title="상담 상세" userName={user?.name || "-"} />

      <Box className={styles.contentContainer}>
        <div className={styles.buttonContainer}>
          {!isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                className={styles.editButton}
              >
                수정
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleDeleteClick}
                className={styles.deleteButton}
              >
                삭제
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<CloseIcon />}
                onClick={handleCancelEdit}
                className={styles.cancelButton}
              >
                취소
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                className={styles.saveButton}
              >
                저장
              </Button>
            </>
          )}
        </div>

        {/* 기본 상담 정보 */}
        <div className={styles.card}>
          <Typography className={styles.cardTitle}>기본 정보</Typography>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>상담 제목</span>
              {isEditing ? (
                <TextField
                  value={data.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <span className={styles.infoValue}>{data.title}</span>
              )}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>상담 유형</span>
              {isEditing ? (
                <FormControl fullWidth size="small">
                  <Select
                    value={data.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  >
                    {Object.entries(COUNSEL_TYPES).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Box sx={{ display: 'inline-block' }}>
                  <Chip
                    label={COUNSEL_TYPES[data.type]}
                    size="small"
                    sx={{
                      backgroundColor: data.type === "PURCHASE" ? "#164F9E" :
                                     data.type === "SALE" ? "#2E7D32" :
                                     data.type === "LEASE" ? "#D4A72C" :
                                     data.type === "RENT" ? "#7B1FA2" : "#666666",
                      color: "white",
                      height: "24px",
                      "& .MuiChip-label": {
                        px: 1,
                        fontSize: "12px"
                      }
                    }}
                  />
                </Box>
              )}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>상담 일시</span>
              {isEditing ? (
                <TextField
                  type="datetime-local"
                  value={dayjs(data.counselDate).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) => handleInputChange("counselDate", e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <span className={styles.infoValue}>
                  {dayjs(data.counselDate).format("YYYY-MM-DD HH:mm")}
                </span>
              )}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>희망 의뢰 마감일</span>
              {isEditing ? (
                <TextField
                  type="date"
                  value={data.dueDate ? dayjs(data.dueDate).format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <span className={styles.infoValue}>
                  {data.dueDate ? dayjs(data.dueDate).format("YYYY-MM-DD") : "-"}
                </span>
              )}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>상태</span>
              {isEditing ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.completed}
                      onChange={(e) =>
                        handleInputChange("completed", e.target.checked)
                      }
                    />
                  }
                  label="완료"
                />
              ) : (
                <Box sx={{ display: 'inline-block' }}>
                  <Chip
                    label={data.completed ? "완료" : "진행중"}
                    size="small"
                    sx={{
                      backgroundColor: data.completed ? "#E9F7EF" : "#FEF5EB",
                      color: data.completed ? "#219653" : "#F2994A",
                      height: "24px",
                      "& .MuiChip-label": {
                        px: 1,
                        fontSize: "12px"
                      }
                    }}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>

        {/* 고객 정보 */}
        <div className={styles.card}>
          <Typography className={styles.cardTitle}>고객 정보</Typography>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이름</span>
              <span className={styles.infoValue}>{data.customer.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>연락처</span>
              <span className={styles.infoValue}>{data.customer.phoneNo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>고객 유형</span>
              <span className={styles.infoValue}>
                {data.customer.tenant && '임차인'}
                {data.customer.landlord && '임대인'}
                {data.customer.buyer && '매수자'}
                {data.customer.seller && '매도자'}
                {!data.customer.tenant && !data.customer.landlord && !data.customer.buyer && !data.customer.seller && '-'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>희망 지역</span>
              <span className={styles.infoValue}>
                {data.customer.preferredRegion || '-'}
              </span>
            </div>
            {data.customer.minPrice !== null && data.customer.maxPrice !== null && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>희망 매매가</span>
                <span className={styles.infoValue}>
                  {data.customer.minPrice.toLocaleString()} ~ {data.customer.maxPrice.toLocaleString()}원
                </span>
              </div>
            )}
            {data.customer.minDeposit !== null && data.customer.maxDeposit !== null && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>희망 보증금</span>
                <span className={styles.infoValue}>
                  {data.customer.minDeposit.toLocaleString()} ~ {data.customer.maxDeposit.toLocaleString()}원
                </span>
              </div>
            )}
            {data.customer.minRent !== null && data.customer.maxRent !== null && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>희망 월세</span>
                <span className={styles.infoValue}>
                  {data.customer.minRent.toLocaleString()} ~ {data.customer.maxRent.toLocaleString()}원
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 부동산 정보 */}
        {data.property && (
          <div className={styles.card}>
            <Typography className={styles.cardTitle}>부동산 정보</Typography>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>주소</span>
                <span className={styles.infoValue}>{data.property.address}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>매물 유형</span>
                <span className={styles.infoValue}>
                  {PROPERTY_CATEGORIES[data.property.type as PropertyCategory] || data.property.type}
                </span>
              </div>
              {data.property.price !== null && data.property.price !== 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>매매가</span>
                  <span className={styles.infoValue}>
                    {data.property.price.toLocaleString()}원
                  </span>
                </div>
              )}
              {data.property.deposit !== null && data.property.deposit !== 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>보증금</span>
                  <span className={styles.infoValue}>
                    {data.property.deposit.toLocaleString()}원
                  </span>
                </div>
              )}
              {data.property.monthlyRent !== null && data.property.monthlyRent !== 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>월세</span>
                  <span className={styles.infoValue}>
                    {data.property.monthlyRent.toLocaleString()}원
                  </span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>전용면적</span>
                <span className={styles.infoValue}>
                  {data.property.exclusiveArea}㎡
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>공급면적</span>
                <span className={styles.infoValue}>
                  {data.property.supplyArea}㎡
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>층수</span>
                <span className={styles.infoValue}>{data.property.floor}층</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>준공년도</span>
                <span className={styles.infoValue}>{data.property.constructionYear}년</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>특징</span>
                <div className={styles.featureChips}>
                  {data.property.hasElevator && (
                    <span className={styles.featureChip}>엘리베이터</span>
                  )}
                  {data.property.parkingCapacity > 0 && (
                    <span className={styles.featureChip}>주차 {data.property.parkingCapacity}대</span>
                  )}
                  {data.property.hasPet && (
                    <span className={styles.featureChip}>반려동물</span>
                  )}
                </div>
              </div>
              {data.property.description && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>상세 설명</span>
                  <span className={styles.infoValue}>{data.property.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 상담 내용 */}
        <div className={styles.card}>
          <Typography className={styles.cardTitle}>상담 내용</Typography>
          <div className={styles.detailList}>
            {data.counselDetails.map((detail) => (
              <div key={detail.counselDetailUid} className={styles.detailItem}>
                {isEditing ? (
                  <>
                    <TextField
                      label="질문"
                      value={detail.question}
                      onChange={(e) =>
                        handleDetailChange(
                          detail.counselDetailUid,
                          "question",
                          e.target.value
                        )
                      }
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                    <TextField
                      label="답변"
                      value={detail.answer}
                      onChange={(e) =>
                        handleDetailChange(
                          detail.counselDetailUid,
                          "answer",
                          e.target.value
                        )
                      }
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      margin="normal"
                    />
                    <IconButton
                      onClick={() =>
                        handleRemoveQuestion(detail.counselDetailUid)
                      }
                      size="small"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Typography className={styles.detailQuestion}>
                      {detail.question}
                    </Typography>
                    <Typography className={styles.detailAnswer}>
                      {detail.answer}
                    </Typography>
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddQuestion}
                fullWidth
              >
                질문 추가
              </Button>
            )}
          </div>
        </div>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>상담 삭제</DialogTitle>
          <DialogContent>
            <Typography>
              정말로 상담을 삭제하시겠습니까?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>취소</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default CounselDetailPage;
