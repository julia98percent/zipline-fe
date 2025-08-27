import { TextField, Checkbox, FormControlLabel, Chip } from "@mui/material";
import Select, { MenuItem } from "@components/Select";
import dayjs, { Dayjs } from "dayjs";
import { CounselCategoryType, Counsel } from "@ts/counsel";
import DatePicker from "@components/DatePicker";
import InfoField from "@components/InfoField";

interface CounselBasicInfoProps {
  data: Counsel;
  isEditing: boolean;
  COUNSEL_TYPES: Record<CounselCategoryType, string>;
  onInputChange: (
    field: keyof Counsel,
    value: string | boolean | Dayjs | null
  ) => void;
}

const StringBooleanSelect = Select<string | boolean>;

const CounselBasicInfo = ({
  data,
  isEditing,
  COUNSEL_TYPES,
  onInputChange,
}: CounselBasicInfoProps) => {
  return (
    <div className="card p-5">
      <h6 className="text-lg font-semibold text-primary mb-2">기본 정보</h6>

      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <InfoField
            label="상담 제목"
            value={
              <TextField
                value={data.title}
                onChange={(e) => onInputChange("title", e.target.value)}
                fullWidth
              />
            }
          />
          <InfoField
            label="상담 유형"
            value={
              <StringBooleanSelect
                value={data.type}
                onChange={(e) => onInputChange("type", e.target.value)}
                size="medium"
                fullWidth
              >
                {Object.entries(COUNSEL_TYPES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </StringBooleanSelect>
            }
          />
          <InfoField
            label="상담 일시"
            value={
              <DatePicker
                value={dayjs(data.counselDate)}
                onChange={(date) => onInputChange("counselDate", date)}
                className="w-full"
              />
            }
          />
          <InfoField
            label="의뢰 마감일"
            value={
              <DatePicker
                value={dayjs(data.dueDate)}
                onChange={(date) => onInputChange("dueDate", date)}
                className="w-full"
              />
            }
          />
          <InfoField
            label="의뢰 완료 여부"
            value={
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.completed}
                    onChange={(e) =>
                      onInputChange("completed", e.target.checked)
                    }
                  />
                }
                label="완료"
              />
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          <InfoField label="상담 제목" value={data.title} />
          <InfoField
            label="상담 유형"
            value={
              <Chip
                label={COUNSEL_TYPES[data.type]}
                size="small"
                variant="outlined"
                color="primary"
              />
            }
          />
          <InfoField
            label="상담 일시"
            value={dayjs(data.counselDate).format("YYYY-MM-DD")}
          />
          <InfoField
            label="의뢰 마감일"
            value={
              data.dueDate ? dayjs(data.dueDate).format("YYYY-MM-DD") : "-"
            }
          />
          <InfoField
            label="의뢰 완료 여부"
            value={
              <Chip
                label={data.completed ? "완료" : "진행 중"}
                size="small"
                variant="outlined"
                color={data.completed ? "success" : "default"}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default CounselBasicInfo;
