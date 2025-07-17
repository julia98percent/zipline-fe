import {
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import dayjs from "dayjs";
import styles from "../styles/CounselDetailPage.module.css";
import { CounselCategoryType, Counsel } from "@ts/counsel";

interface CounselBasicInfoProps {
  data: Counsel;
  isEditing: boolean;
  COUNSEL_TYPES: Record<CounselCategoryType, string>;
  onInputChange: (field: keyof Counsel, value: string | boolean) => void;
}

const StringBooleanSelect = Select<string | boolean>;

const CounselBasicInfo = ({
  data,
  isEditing,
  COUNSEL_TYPES,
  onInputChange,
}: CounselBasicInfoProps) => {
  return (
    <div className={styles.card}>
      <Typography className={styles.cardTitle}>기본 정보</Typography>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>상담 제목</span>
          {isEditing ? (
            <TextField
              value={data.title}
              onChange={(e) => onInputChange("title", e.target.value)}
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
            <StringBooleanSelect
              value={data.type}
              onChange={(e) => onInputChange("type", e.target.value)}
            >
              {Object.entries(COUNSEL_TYPES).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </StringBooleanSelect>
          ) : (
            <Box sx={{ display: "inline-block" }}>
              <Chip
                label={COUNSEL_TYPES[data.type]}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          )}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>상담 일시</span>
          {isEditing ? (
            <TextField
              type="date"
              value={dayjs(data.counselDate).format("YYYY-MM-DD")}
              onChange={(e) => onInputChange("counselDate", e.target.value)}
              fullWidth
              size="small"
            />
          ) : (
            <span className={styles.infoValue}>
              {dayjs(data.counselDate).format("YYYY-MM-DD")}
            </span>
          )}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>완료 예정일</span>
          {isEditing ? (
            <TextField
              type="date"
              value={dayjs(data.dueDate).format("YYYY-MM-DD")}
              onChange={(e) => onInputChange("dueDate", e.target.value)}
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
          <span className={styles.infoLabel}>완료 여부</span>
          {isEditing ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.completed}
                  onChange={(e) => onInputChange("completed", e.target.checked)}
                />
              }
              label="완료"
            />
          ) : (
            <Box sx={{ display: "inline-block" }}>
              <Chip
                label={data.completed ? "완료" : "진행중"}
                size="small"
                variant="outlined"
                color={data.completed ? "success" : "default"}
              />
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselBasicInfo;
