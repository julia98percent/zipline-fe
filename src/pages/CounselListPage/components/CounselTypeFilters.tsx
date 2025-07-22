import { CounselCategory } from "@ts/counsel";
import Button from "@components/Button";

interface Props {
  selectedType: string | null;
  selectedCompleted: boolean | null;
  onTypeChange: (type: string | null) => void;
  onCompletedChange: (completed: boolean | null) => void;
}

const COUNSEL_TYPES = Object.entries(CounselCategory).map(([value, label]) => ({
  value,
  label,
}));

const CounselTypeFilters = ({
  selectedType,
  selectedCompleted,
  onTypeChange,
  onCompletedChange,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {COUNSEL_TYPES.map((type) => (
        <Button
          key={type.value}
          variant={selectedType === type.value ? "contained" : "outlined"}
          color={selectedType === type.value ? "primary" : "info"}
          onClick={() => {
            onTypeChange(selectedType === type.value ? null : type.value);
          }}
        >
          {type.label}
        </Button>
      ))}
      <span className="text-gray-300 mx-1 font-light">|</span>
      <Button
        variant={selectedCompleted === false ? "contained" : "outlined"}
        color={selectedCompleted === false ? "primary" : "info"}
        onClick={() => {
          onCompletedChange(selectedCompleted === false ? null : false);
        }}
      >
        의뢰 진행중
      </Button>
      <Button
        variant={selectedCompleted ? "contained" : "outlined"}
        color={selectedCompleted ? "primary" : "info"}
        onClick={() => {
          onCompletedChange(selectedCompleted === true ? null : true);
        }}
      >
        의뢰 마감
      </Button>
    </div>
  );
};

export default CounselTypeFilters;
