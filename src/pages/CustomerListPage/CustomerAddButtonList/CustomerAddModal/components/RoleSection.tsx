import { FormControlLabel, Checkbox } from "@mui/material";

interface RoleSectionProps {
  seller: boolean;
  buyer: boolean;
  tenant: boolean;
  landlord: boolean;
  onRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RoleSection({
  seller,
  buyer,
  tenant,
  landlord,
  onRoleChange,
}: RoleSectionProps) {
  return (
    <div>
      <h6 className="mb-2 font-semibold">역할</h6>

      <div className="grid grid-cols-3 sm:grid-cols-5">
        <FormControlLabel
          control={
            <Checkbox name="seller" checked={seller} onChange={onRoleChange} />
          }
          label="매도인"
        />
        <FormControlLabel
          control={
            <Checkbox name="buyer" checked={buyer} onChange={onRoleChange} />
          }
          label="매수인"
        />
        <FormControlLabel
          control={
            <Checkbox name="tenant" checked={tenant} onChange={onRoleChange} />
          }
          label="임차인"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="landlord"
              checked={landlord}
              onChange={onRoleChange}
            />
          }
          label="임대인"
        />
      </div>
    </div>
  );
}
