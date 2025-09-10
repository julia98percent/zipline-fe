import { Chip } from "@mui/material";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import AddIcon from "@mui/icons-material/Add";
import { Label } from "@/types/customer";

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
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h6 className="mb-2 font-semibold">라벨</h6>
        <Button
          startIcon={<AddIcon />}
          onClick={() => onSetIsAddingLabel(true)}
        >
          라벨 추가
        </Button>
      </div>

      {/* 라벨 추가 입력 필드 */}
      {isAddingLabel && (
        <div className="flex gap-2 mb-4">
          <TextField
            size="small"
            value={newLabelName}
            onChange={(e) => onSetNewLabelName(e.target.value)}
            placeholder="새 라벨 이름"
            fullWidth
          />
          <Button onClick={onAddLabel}>추가</Button>
          <Button
            onClick={() => {
              onSetIsAddingLabel(false);
              onSetNewLabelName("");
            }}
            variant="outlined"
            color="info"
          >
            취소
          </Button>
        </div>
      )}

      {/* 라벨 목록 */}
      <div className="flex flex-wrap gap-2">
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
                ? "	#2A6FDB"
                : "transparent",
              color: selectedLabels.some((l) => l.uid === label.uid)
                ? "white"
                : "inherit",
              border: "1px solid #164F9E",
              "&:hover": {
                backgroundColor: selectedLabels.some((l) => l.uid === label.uid)
                  ? "	#2A6FDB"
                  : "rgba(99, 102, 241, 0.1)",
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
