import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";

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
    <Box className="mb-8">
      <Typography variant="h6" className="mb-4 font-bold">
        역할
      </Typography>
      <Box className="flex gap-8">
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
      </Box>
    </Box>
  );
}
