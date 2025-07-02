import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { FilterSectionProps } from "@ts/customer";
import { useCallback } from "react";

const ROLES = ["tenant", "landlord", "buyer", "seller"] as const;
const ROLE_LABELS = {
  tenant: "임차인",
  landlord: "임대인",
  buyer: "매수자",
  seller: "매도자",
} as const;

const RoleFilters = ({ filtersTemp, setFiltersTemp }: FilterSectionProps) => {
  const handleChange = useCallback(
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;

      if (name === "noRole") {
        if (value) {
          setFiltersTemp((prev) => ({
            ...prev,
            noRole: true,
            tenant: false,
            landlord: false,
            buyer: false,
            seller: false,
          }));
        } else {
          setFiltersTemp((prev) => ({
            ...prev,
            noRole: false,
          }));
        }
      } else if (ROLES.includes(name as (typeof ROLES)[number])) {
        if (value) {
          setFiltersTemp((prev) => ({
            ...prev,
            [name]: value,
            noRole: false,
          }));
        } else {
          setFiltersTemp((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      }
    },
    [setFiltersTemp]
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        역할
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {ROLES.map((role) => {
          const isChecked = filtersTemp[
            role as keyof typeof filtersTemp
          ] as boolean;

          return (
            <FormControlLabel
              key={role}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleChange(role)}
                  disabled={filtersTemp.noRole}
                />
              }
              label={ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
            />
          );
        })}
        <FormControlLabel
          control={
            <Checkbox
              checked={filtersTemp.noRole}
              onChange={handleChange("noRole")}
            />
          }
          label="역할 없음"
        />
      </Box>
    </Box>
  );
};

export default RoleFilters;
