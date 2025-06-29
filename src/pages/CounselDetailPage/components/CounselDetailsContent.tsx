import { Typography, TextField, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import styles from "../styles/CounselDetailPage.module.css";
import { CounselDetailItem } from "@ts/counsel";

interface CounselDetailsContentProps {
  counselDetails: CounselDetailItem[];
  isEditing: boolean;
  onDetailChange: (
    detailUid: number,
    field: keyof CounselDetailItem,
    value: string
  ) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (counselDetailUid: number) => void;
}

const CounselDetailsContent = ({
  counselDetails,
  isEditing,
  onDetailChange,
  onAddQuestion,
  onRemoveQuestion,
}: CounselDetailsContentProps) => {
  return (
    <div className={styles.card}>
      <Typography className={styles.cardTitle}>상담 내용</Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {counselDetails.map((detail, index) => (
          <div key={detail.counselDetailUid} className={styles.questionCard}>
            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Typography variant="h6">질문 {index + 1}</Typography>
                {counselDetails.length > 1 && (
                  <IconButton
                    onClick={() => onRemoveQuestion(detail.counselDetailUid)}
                    color="error"
                    size="small"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </div>
            )}
            {isEditing ? (
              <>
                <TextField
                  label="질문"
                  value={detail.question}
                  onChange={(e) =>
                    onDetailChange(
                      detail.counselDetailUid,
                      "question",
                      e.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                />
                <TextField
                  label="답변"
                  value={detail.answer}
                  onChange={(e) =>
                    onDetailChange(
                      detail.counselDetailUid,
                      "answer",
                      e.target.value
                    )
                  }
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </>
            ) : (
              <>
                <Typography className={styles.detailQuestion}>
                  Q: {detail.question}
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
            onClick={onAddQuestion}
            fullWidth
          >
            질문 추가
          </Button>
        )}
      </div>
    </div>
  );
};

export default CounselDetailsContent;
