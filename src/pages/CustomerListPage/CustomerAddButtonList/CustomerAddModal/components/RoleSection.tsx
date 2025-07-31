import { FormControlLabel, Checkbox } from "@mui/material";

interface RoleSectionProps {
  seller: boolean;
  buyer: boolean;
  tenant: boolean;
  landlord: boolean;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RoleSection({
  seller,
  buyer,
  tenant,
  landlord,
  onFieldChange,
}: RoleSectionProps) {
  return (
    <div>
      <h6 className="mb-2 font-semibold">역할</h6>

      <div className="grid grid-cols-3 sm:grid-cols-5">
        <FormControlLabel
          control={
            <Checkbox name="seller" checked={seller} onChange={onFieldChange} />
          }
          label="매도인"
        />
        <FormControlLabel
          control={
            <Checkbox name="buyer" checked={buyer} onChange={onFieldChange} />
          }
          label="매수인"
        />
        <FormControlLabel
          control={
            <Checkbox name="tenant" checked={tenant} onChange={onFieldChange} />
          }
          label="임차인"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="landlord"
              checked={landlord}
              onChange={onFieldChange}
            />
          }
          label="임대인"
        />
      </div>
    </div>
  );
}
