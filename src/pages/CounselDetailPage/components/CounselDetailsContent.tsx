import { Typography, TextField } from "@mui/material";

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
}

const CounselDetailsContent = ({
  counselDetails,
  isEditing,
  onDetailChange,
}: CounselDetailsContentProps) => {
  return (
    <div className={styles.card}>
      <Typography className={styles.cardTitle}>상담 내용</Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {counselDetails.map((detail) => (
          <div key={detail.counselDetailUid} className={styles.questionCard}>
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
              <TextField
                label="질문"
                value={detail.content}
                onChange={(e) =>
                  onDetailChange(
                    detail.counselDetailUid,
                    "content",
                    e.target.value
                  )
                }
                fullWidth
                multiline
                rows={2}
                margin="normal"
              />
            ) : (
              <>
                <Typography className={styles.detailQuestion}>
                  {detail.content}
                </Typography>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounselDetailsContent;
