import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { formatPhoneNumber } from "@utils/numberUtil";
import RegionSelect from "@components/RegionSelect/RegionSelect";
import { Customer } from "@ts/customer";

interface CustomerBasicInfoProps {
  customer: Customer;
  isEditing: boolean;
  editedCustomer: Customer | null;
  onInputChange: (
    field: keyof Customer,
    value: string | number | boolean | null | { uid: number; name: string }[]
  ) => void;
  onRegionChange: (value: { code: number | null; name: string }) => void;
}

const CustomerBasicInfo = ({
  customer,
  isEditing,
  editedCustomer,
  onInputChange,
  onRegionChange,
}: CustomerBasicInfoProps) => {
  const formatBirthDay = (birthday: string | null) => {
    if (!birthday) return "-";
    return birthday.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
  };

  return (
    <Paper elevation={0} sx={{ flex: 2, p: 3, borderRadius: 2, mt: 1 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#164F9E", fontWeight: "bold" }}
      >
        기본 정보
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
          <Typography variant="subtitle2" color="textSecondary">
            이름
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={editedCustomer?.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
            />
          ) : (
            <Typography variant="body1">{customer.name}</Typography>
          )}
        </Box>
        <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
          <Typography variant="subtitle2" color="textSecondary">
            전화번호
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={formatPhoneNumber(editedCustomer?.phoneNo ?? "")}
              onChange={(e) => onInputChange("phoneNo", e.target.value)}
            />
          ) : (
            <Typography variant="body1">{customer.phoneNo}</Typography>
          )}
        </Box>
        <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
          <Typography variant="subtitle2" color="textSecondary">
            통신사
          </Typography>
          {isEditing ? (
            <FormControl fullWidth size="small">
              <Select
                value={editedCustomer?.telProvider || ""}
                onChange={(e) => onInputChange("telProvider", e.target.value)}
              >
                <MenuItem value="SKT">SKT</MenuItem>
                <MenuItem value="KT">KT</MenuItem>
                <MenuItem value="LGU+">LGU+</MenuItem>
                <MenuItem value="SKT 알뜰폰">SKT 알뜰폰</MenuItem>
                <MenuItem value="KT 알뜰폰">KT 알뜰폰</MenuItem>
                <MenuItem value="LGU+ 알뜰폰">LGU+ 알뜰폰</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Typography variant="body1">
              {customer.telProvider || "-"}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
          <Typography variant="subtitle2" color="textSecondary">
            희망 지역
          </Typography>
          {isEditing ? (
            <RegionSelect
              value={{
                code: editedCustomer?.legalDistrictCode ?? null,
                name: editedCustomer?.preferredRegion ?? "",
              }}
              onChange={onRegionChange}
              disabled={false}
            />
          ) : (
            <Typography variant="body1">
              {customer.preferredRegion || "-"}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
          <Typography variant="subtitle2" color="textSecondary">
            생년월일
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={editedCustomer?.birthday || ""}
              onChange={(e) => onInputChange("birthday", e.target.value)}
              placeholder="YYYYMMDD"
            />
          ) : (
            <Typography variant="body1">
              {formatBirthDay(customer.birthday)}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: "0 0 calc(50% - 8px)" }}>
          <Typography variant="subtitle2" color="textSecondary">
            유입 경로
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              size="small"
              value={editedCustomer?.trafficSource || ""}
              onChange={(e) => onInputChange("trafficSource", e.target.value)}
            />
          ) : (
            <Typography variant="body1">
              {customer.trafficSource || "-"}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CustomerBasicInfo;
