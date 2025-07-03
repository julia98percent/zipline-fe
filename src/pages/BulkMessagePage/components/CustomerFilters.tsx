import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Label } from "@ts/customer";
import { Region, RegionState } from "@ts/region";

interface CustomerFiltersProps {
  search: string;
  region: RegionState;
  roleFilters: {
    tenant: boolean;
    landlord: boolean;
    buyer: boolean;
    seller: boolean;
    noRole: boolean;
  };
  labelUids: number[];
  labels: Label[];
  onSearchChange: (value: string) => void;
  onRegionChange: (
    type: "sido" | "sigungu" | "dong"
  ) => (event: SelectChangeEvent<string>) => void;
  onRoleFilterChange: (role: string) => void;
  onLabelFilterChange: (labelUid: number) => void;
}

const ROLE_LABELS: Record<string, string> = {
  tenant: "임차인",
  landlord: "임대인",
  buyer: "매수자",
  seller: "매도자",
  noRole: "역할없음",
};

const ROLE_COLORS: Record<
  string,
  { bg: string; color: string; selectedBg?: string; selectedColor?: string }
> = {
  tenant: { bg: "#FEF5EB", color: "#F2994A" },
  landlord: { bg: "#FDEEEE", color: "#EB5757" },
  buyer: { bg: "#E9F7EF", color: "#219653" },
  seller: { bg: "#EBF2FC", color: "#2F80ED" },
  noRole: {
    bg: "#F5F5F5",
    color: "#666666",
    selectedBg: "#BDBDBD",
    selectedColor: "#fff",
  },
};

const CustomerFilters = ({
  search,
  region,
  roleFilters,
  labelUids,
  labels,
  onSearchChange,
  onRegionChange,
  onRoleFilterChange,
  onLabelFilterChange,
}: CustomerFiltersProps) => {
  return (
    <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: "28px" }}>
      <Box
        sx={{
          display: "flex",
          gap: "28px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* 검색창 */}
        <TextField
          size="small"
          placeholder="이름, 전화번호 검색"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: 180 }}
        />

        {/* 지역 선택 */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#666666", minWidth: 60 }}>
            지역
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {(["sido", "sigungu", "dong"] as const).map((type) => {
              const regions = region[type] as Region[];
              const selectedValue =
                region[
                  `selected${type.charAt(0).toUpperCase() + type.slice(1)}`
                ];

              return (
                <FormControl key={type} size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={
                      regions.find((item) => item.cortarNo === selectedValue)
                        ?.cortarName || ""
                    }
                    onChange={onRegionChange(type)}
                    displayEmpty
                    disabled={
                      type !== "sido" &&
                      !region[`selected${type === "dong" ? "Sigungu" : "Sido"}`]
                    }
                    sx={{
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#164F9E",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#164F9E",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>
                        {type === "sido"
                          ? "시/도"
                          : type === "sigungu"
                          ? "시/군/구"
                          : "읍/면/동"}
                      </em>
                    </MenuItem>
                    {regions.map((item) => (
                      <MenuItem key={item.cortarNo} value={item.cortarName}>
                        {item.cortarName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            })}
          </Box>
        </Box>

        {/* 역할 필터 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#666666", minWidth: 60 }}>
            고객 역할
          </Typography>
          {(Object.keys(roleFilters) as (keyof typeof roleFilters)[]).map(
            (role) => (
              <Chip
                key={role}
                label={ROLE_LABELS[role]}
                onClick={() => onRoleFilterChange(role)}
                sx={{
                  backgroundColor:
                    role === "noRole"
                      ? roleFilters[role]
                        ? ROLE_COLORS.noRole.selectedBg
                        : ROLE_COLORS.noRole.bg
                      : roleFilters[role]
                      ? ROLE_COLORS[role].bg
                      : "#F8F9FA",
                  color:
                    role === "noRole"
                      ? roleFilters[role]
                        ? ROLE_COLORS.noRole.selectedColor
                        : ROLE_COLORS.noRole.color
                      : roleFilters[role]
                      ? ROLE_COLORS[role].color
                      : "#666666",
                  fontWeight: 500,
                  borderRadius: "4px",
                  height: "28px",
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor:
                      role === "noRole"
                        ? roleFilters[role]
                          ? ROLE_COLORS.noRole.selectedBg
                          : "#E0E0E0"
                        : roleFilters[role]
                        ? ROLE_COLORS[role].bg
                        : "#E0E0E0",
                  },
                }}
              />
            )
          )}
        </Box>

        {/* 라벨 필터 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "#666666", minWidth: 60 }}>
            고객 라벨
          </Typography>
          {labels.map((label) => (
            <Chip
              key={label.uid}
              label={label.name}
              onClick={() => onLabelFilterChange(label.uid)}
              sx={{
                backgroundColor: labelUids.includes(label.uid)
                  ? "#164F9E"
                  : "#F8F9FA",
                color: labelUids.includes(label.uid) ? "#FFFFFF" : "#666666",
                "&:hover": {
                  backgroundColor: labelUids.includes(label.uid)
                    ? "#0D3B7A"
                    : "#E0E0E0",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerFilters;
