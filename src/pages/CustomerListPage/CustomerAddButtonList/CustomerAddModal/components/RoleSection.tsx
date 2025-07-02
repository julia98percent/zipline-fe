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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        역할
      </Typography>
      <Box sx={{ display: "flex", gap: 4 }}>
        <FormControlLabel
          control={
            <Checkbox name="seller" checked={seller} onChange={onFieldChange} />
          }
          label="매도자"
        />
        <FormControlLabel
          control={
            <Checkbox name="buyer" checked={buyer} onChange={onFieldChange} />
          }
          label="매수자"
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
