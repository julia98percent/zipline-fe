import { TextField, MenuItem } from "@mui/material";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import { AgentPropertyResponse } from "@apis/contractService";
import { ContractStatus, FormErrors } from "@ts/contract";

interface Props {
  category: string | null;
  setCategory: (category: string | null) => void;
  status: ContractStatus;
  setStatus: (status: ContractStatus) => void;
  propertyUid: number | null;
  setPropertyUid: (uid: number | null) => void;
  propertyOptions: AgentPropertyResponse[];
  errors: FormErrors;
}

const ContractBasicInfoSection = ({
  category,
  setCategory,
  status,
  setStatus,
  propertyUid,
  setPropertyUid,
  propertyOptions,
  errors,
}: Props) => {
  return (
    <>
      <TextField
        select
        label="계약 카테고리"
        value={category ?? ""}
        onChange={(e) => setCategory(e.target.value)}
        error={!!errors.category}
        helperText={errors.category}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="SALE">매매</MenuItem>
        <MenuItem value="DEPOSIT">전세</MenuItem>
        <MenuItem value="MONTHLY">월세</MenuItem>
      </TextField>

      <TextField
        select
        label="계약 상태 *"
        value={status}
        onChange={(e) => setStatus(e.target.value as ContractStatus)}
        error={!!errors.status}
        helperText={errors.status}
        fullWidth
        sx={{ mb: 2 }}
      >
        {CONTRACT_STATUS_OPTION_LIST.map((s) => (
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="매물 *"
        value={propertyUid ?? ""}
        onChange={(e) => setPropertyUid(Number(e.target.value))}
        error={!!errors.propertyUid}
        helperText={errors.propertyUid}
        fullWidth
        sx={{ mb: 2 }}
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
      </TextField>
    </>
  );
};

export default ContractBasicInfoSection;
