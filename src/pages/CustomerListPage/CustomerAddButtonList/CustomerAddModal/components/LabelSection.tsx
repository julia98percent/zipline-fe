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
    <Box className="mb-8">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-bold">
          라벨 선택
        </Typography>
        <Button
          className="bg-[#164F9E]"
          startIcon={<AddIcon />}
          onClick={() => onSetIsAddingLabel(true)}
        >
          라벨 추가
        </Button>
      </Box>

      {/* 라벨 추가 입력 필드 */}
      {isAddingLabel && (
        <Box className="flex gap-2 mb-4">
          <TextField
            size="small"
            value={newLabelName}
            onChange={(e) => onSetNewLabelName(e.target.value)}
            placeholder="새 라벨 이름"
            fullWidth
          />
          <Button
            onClick={onAddLabel}
            className="bg-[#164F9E] text-white hover:bg-[#0D3B7A]"
          >
            추가
          </Button>
          <Button
            onClick={() => {
              onSetIsAddingLabel(false);
              onSetNewLabelName("");
            }}
            className="border-[#164F9E] text-[#164F9E]"
            variant="outlined"
          >
            취소
          </Button>
        </Box>
      )}

      {/* 라벨 목록 */}
      <Box className="flex flex-wrap gap-2">
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
