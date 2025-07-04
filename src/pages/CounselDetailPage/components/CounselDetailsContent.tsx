import { Typography, TextareaAutosize as TextArea } from "@mui/material";

import styles from "../styles/CounselDetailPage.module.css";

interface CounselDetailsContentProps {
  content: string;
  isEditing: boolean;
  onDetailChange: (value: string) => void;
}

const CounselDetailsContent = ({
  content,
  isEditing,
  onDetailChange,
}: CounselDetailsContentProps) => {
  return (
    <div className={styles.card}>
      <Typography className={styles.cardTitle}>상담 내용</Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className={styles.questionCard}>
          {isEditing && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            ></div>
          )}
          {isEditing ? (
            <TextArea
              minRows={3}
              value={content}
              onChange={(e) => onDetailChange(e.target.value)}
            />
          ) : (
            <Typography className={styles.detailQuestion}>{content}</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselDetailsContent;
