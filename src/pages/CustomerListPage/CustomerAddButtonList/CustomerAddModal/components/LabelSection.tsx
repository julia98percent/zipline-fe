import { Box, Typography, Chip } from "@mui/material";
import Button from "@components/Button";
import TextField from "@components/TextField";
import AddIcon from "@mui/icons-material/Add";
import { Label } from "@ts/customer";

interface LabelSectionProps {
  labels: Label[];
  selectedLabels: Label[];
  isAddingLabel: boolean;
  newLabelName: string;
  onLabelSelect: (label: Label) => void;
  onAddLabel: () => void;
  onSetIsAddingLabel: (value: boolean) => void;
  onSetNewLabelName: (value: string) => void;
}

export default function LabelSection({
  labels,
  selectedLabels,
  isAddingLabel,
  newLabelName,
  onLabelSelect,
  onAddLabel,
  onSetIsAddingLabel,
  onSetNewLabelName,
}: LabelSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          라벨 선택
        </Typography>
        <Button
          text="라벨 추가"
          startIcon={<AddIcon />}
          sx={{ color: "#164F9E" }}
          onClick={() => onSetIsAddingLabel(true)}
        />
      </Box>

      {/* 라벨 추가 입력 필드 */}
      {isAddingLabel && (
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            size="small"
            value={newLabelName}
            onChange={(e) => onSetNewLabelName(e.target.value)}
            placeholder="새 라벨 이름"
            fullWidth
          />
          <Button
            text="추가"
            onClick={onAddLabel}
            sx={{
              backgroundColor: "#164F9E",
              color: "white",
              "&:hover": {
                backgroundColor: "#0D3B7A",
              },
            }}
          />
          <Button
            text="취소"
            onClick={() => {
              onSetIsAddingLabel(false);
              onSetNewLabelName("");
            }}
            sx={{
              color: "#164F9E",
              borderColor: "#164F9E",
            }}
            variant="outlined"
          />
        </Box>
      )}

      {/* 라벨 목록 */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {labels.map((label) => (
          <Chip
            key={label.uid}
            label={label.name}
            onClick={() => onLabelSelect(label)}
            onDelete={
              selectedLabels.some((l) => l.uid === label.uid)
                ? () => onLabelSelect(label)
                : undefined
            }
            sx={{
              backgroundColor: selectedLabels.some((l) => l.uid === label.uid)
                ? "#6366F1"
                : "transparent",
              color: selectedLabels.some((l) => l.uid === label.uid)
                ? "white"
                : "inherit",
              border: "1px solid #164F9E",
              "&:hover": {
                backgroundColor: selectedLabels.some((l) => l.uid === label.uid)
                  ? "#0D3B7A"
                  : "rgba(99, 102, 241, 0.1)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
