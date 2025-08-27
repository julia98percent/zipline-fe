import { MenuItem } from "@mui/material";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import { AgentPropertyResponse } from "@apis/contractService";
import { ContractStatus } from "@ts/contract";
import { StringSelect } from "@components/Select";

interface Props {
  category: string | null;
  handleCategoryChange: (category: string | null) => void;
  status: ContractStatus;
  setStatus: (status: ContractStatus) => void;
  propertyUid: number | null;
  setPropertyUid: (uid: number | null) => void;
  propertyOptions: AgentPropertyResponse[];
}

const ContractBasicInfoSection = ({
  category,
  handleCategoryChange,
  status,
  setStatus,
  propertyUid,
  setPropertyUid,
  propertyOptions,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 p-5 card">
      <StringSelect
        label="계약 카테고리"
        value={category ?? ""}
        onChange={(e) => handleCategoryChange(e.target.value)}
        fullWidth
        size="medium"
      >
        <MenuItem value="SALE">매매</MenuItem>
        <MenuItem value="DEPOSIT">전세</MenuItem>
        <MenuItem value="MONTHLY">월세</MenuItem>
      </StringSelect>

      <StringSelect
        label="계약 상태"
        value={status}
        required
        onChange={(e) => setStatus(e.target.value as ContractStatus)}
        fullWidth
        size="medium"
      >
        {CONTRACT_STATUS_OPTION_LIST.map((s) => (
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
        ))}
      </StringSelect>

      <StringSelect
        label="매물 *"
        required
        value={propertyUid ?? ""}
        onChange={(e) => setPropertyUid(Number(e.target.value))}
        fullWidth
        size="medium"
      >
        {propertyOptions.length > 0 ? (
          propertyOptions.map((p) => (
            <MenuItem key={p.uid} value={p.uid}>
              {p.address}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            등록된 매물이 없습니다
          </MenuItem>
        )}
      </StringSelect>
    </div>
  );
};

export default ContractBasicInfoSection;
