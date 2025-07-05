import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
} from "@mui/material";
import { ContractCategory, ContractCategoryType } from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import { AgentPropertyResponse, CustomerResponse } from "@apis/contractService";

interface ContractBasicInfoEditModalViewProps {
  // Dialog props
  open: boolean;
  onClose: () => void;
  isLoading: boolean;

  category: ContractCategoryType | null;
  status: string;
  contractStartDate: string;
  contractDate: string | null;
  contractEndDate: string;
  expectedContractEndDate: string;
  deposit: string;
  monthlyRent: string;
  price: string;
  other: string;
  selectedLessors: CustomerResponse[];
  selectedLessees: CustomerResponse[];
  selectedPropertyUid: string;

  propertyOptions: AgentPropertyResponse[];
  customerOptions: CustomerResponse[];

  onCategoryChange: (value: ContractCategoryType) => void;
  onStatusChange: (value: string) => void;
  onContractStartDateChange: (value: string) => void;
  onContractDateChange: (value: string) => void;
  onContractEndDateChange: (value: string) => void;
  onExpectedContractEndDateChange: (value: string) => void;
  onDepositChange: (value: string) => void;
  onMonthlyRentChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onOtherChange: (value: string) => void;
  onSelectedLessorsChange: (value: CustomerResponse[]) => void;
  onSelectedLesseesChange: (value: CustomerResponse[]) => void;
  onSelectedPropertyUidChange: (value: string) => void;
  onSubmit: () => void;

  formatPrice: (value: string) => string;
  getCustomerDisplayName: (customer: CustomerResponse) => string;
}

const ContractBasicInfoEditModalView = ({
  open,
  onClose,
  isLoading,
  category,
  status,
  contractStartDate,
  contractDate,
  contractEndDate,
  expectedContractEndDate,
  deposit,
  monthlyRent,
  price,
  other,
  selectedLessors,
  selectedLessees,
  selectedPropertyUid,
  propertyOptions,
  customerOptions,
  onCategoryChange,
  onStatusChange,
  onContractStartDateChange,
  onContractDateChange,
  onContractEndDateChange,
  onExpectedContractEndDateChange,
  onDepositChange,
  onMonthlyRentChange,
  onPriceChange,
  onOtherChange,
  onSelectedLessorsChange,
  onSelectedLesseesChange,
  onSelectedPropertyUidChange,
  onSubmit,
  formatPrice,
  getCustomerDisplayName,
}: ContractBasicInfoEditModalViewProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          계약 정보 수정
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ maxHeight: 600, overflowY: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={category || ""}
                onChange={(e) =>
                  onCategoryChange(e.target.value as ContractCategoryType)
                }
                label="카테고리"
              >
                {Object.entries(ContractCategory).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                label="상태"
              >
                {CONTRACT_STATUS_OPTION_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="계약일"
              type="date"
              value={contractDate}
              onChange={(e) => onContractDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="계약 시작일"
              type="date"
              value={contractStartDate}
              onChange={(e) => onContractStartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="계약 종료일"
              type="date"
              value={contractEndDate}
              onChange={(e) => onContractEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="기타"
              value={other}
              onChange={(e) => onOtherChange(e.target.value)}
              fullWidth
              placeholder="추가 정보를 입력하세요"
            />
          </Box>

          {status === "CANCELLED" && (
            <TextField
              label="계약 예상 종료일"
              type="date"
              value={expectedContractEndDate}
              onChange={(e) => onExpectedContractEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}

          <FormControl fullWidth>
            <InputLabel>매물 선택</InputLabel>
            <Select
              value={selectedPropertyUid}
              onChange={(e) => onSelectedPropertyUidChange(e.target.value)}
              label="매물 선택"
            >
              {propertyOptions.map((property) => (
                <MenuItem key={property.uid} value={property.uid.toString()}>
                  {property.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="보증금 (원)"
              value={formatPrice(deposit)}
              onChange={(e) =>
                onDepositChange(e.target.value.replace(/,/g, ""))
              }
              fullWidth
              placeholder="0"
            />

            <TextField
              label="월세 (원)"
              value={formatPrice(monthlyRent)}
              onChange={(e) =>
                onMonthlyRentChange(e.target.value.replace(/,/g, ""))
              }
              fullWidth
              placeholder="0"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="매매가 (원)"
              value={formatPrice(price)}
              onChange={(e) => onPriceChange(e.target.value.replace(/,/g, ""))}
              fullWidth
              placeholder="0"
            />
            <Box sx={{ flex: 1 }} />
          </Box>

          <Autocomplete
            multiple
            options={customerOptions}
            getOptionLabel={getCustomerDisplayName}
            value={selectedLessors}
            onChange={(_, newValue) => onSelectedLessorsChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={getCustomerDisplayName(option)}
                  {...getTagProps({ index })}
                  key={option.uid}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="임대/매도인 선택" />
            )}
          />

          <Autocomplete
            multiple
            options={customerOptions}
            getOptionLabel={getCustomerDisplayName}
            value={selectedLessees}
            onChange={(_, newValue) => onSelectedLesseesChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={getCustomerDisplayName(option)}
                  {...getTagProps({ index })}
                  key={option.uid}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="임차/매수인 선택" />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          취소
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={
            !category ||
            !status ||
            !selectedPropertyUid ||
            selectedLessors.length === 0 ||
            selectedLessees.length === 0 ||
            isLoading
          }
        >
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractBasicInfoEditModalView;
