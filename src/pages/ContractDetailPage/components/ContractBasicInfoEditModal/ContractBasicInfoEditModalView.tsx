import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { MenuItem, StringSelect } from "@components/Select";
import {
  ContractCategory,
  ContractCategoryKeys,
  ContractCategoryType,
} from "@ts/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@constants/contract";
import { AgentPropertyResponse, CustomerResponse } from "@apis/contractService";
import Button from "@components/Button";
import dayjs from "dayjs";
import DatePicker from "@components/DatePicker";
import { NumericInputResponse } from "@hooks/useNumericInput";
import { formatKoreanPrice } from "@utils/numberUtil";

interface ContractBasicInfoEditModalViewProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  category: ContractCategoryType | null;
  status: string;
  contractStartDate: string;
  contractDate: string | null;
  contractEndDate: string;
  expectedContractEndDate: string | null;
  priceInput: NumericInputResponse;
  monthlyRentInput: NumericInputResponse;
  depositInput: NumericInputResponse;
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
  onOtherChange: (value: string) => void;
  onSelectedLessorsChange: (value: CustomerResponse[]) => void;
  onSelectedLesseesChange: (value: CustomerResponse[]) => void;
  onSelectedPropertyUidChange: (value: string) => void;
  onSubmit: () => void;
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
  depositInput,
  monthlyRentInput,
  priceInput,
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
  onOtherChange,
  onSelectedLessorsChange,
  onSelectedLesseesChange,
  onSelectedPropertyUidChange,
  onSubmit,
  getCustomerDisplayName,
}: ContractBasicInfoEditModalViewProps) => {
  const {
    value: deposit,
    handleChange: handleDepositChange,
    error: depositError,
    handleBlur: handleDepositBlur,
  } = depositInput;

  const {
    value: monthlyRent,
    handleChange: handleMonthlyRentChange,
    error: monthlyError,
    handleBlur: handleMonthlyRentBlur,
  } = monthlyRentInput;

  const {
    value: price,
    handleChange: handlePriceChange,
    error: priceError,
    handleBlur: handlePriceBlur,
  } = priceInput;

  const getValidationErrors = () => {
    const errors: string[] = [];
    if (!status) errors.push("상태를 선택해주세요.");
    if (!selectedPropertyUid) errors.push("매물을 선택해주세요.");
    if (selectedLessors.length === 0)
      errors.push("임대/매도인을 선택해주세요.");
    return errors;
  };

  const validationErrors = getValidationErrors();
  const isSubmitButtonDisabled = validationErrors.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="border-b text-primary font-bold border-gray-200">
        계약 정보 수정
      </DialogTitle>

      <DialogContent className="p-7">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StringSelect
              value={category || ""}
              onChange={(e) =>
                onCategoryChange(e.target.value as ContractCategoryType)
              }
              label="카테고리"
              size="medium"
            >
              {Object.entries(ContractCategory).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </StringSelect>

            <StringSelect
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              label="상태"
              size="medium"
            >
              {CONTRACT_STATUS_OPTION_LIST.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StringSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DatePicker
              label="계약 시작일"
              value={contractStartDate ? dayjs(contractStartDate) : null}
              onChange={(newValue) =>
                onContractStartDateChange(
                  newValue ? newValue.format("YYYY-MM-DD") : ""
                )
              }
            />

            <DatePicker
              label="계약 종료일"
              value={contractEndDate ? dayjs(contractEndDate) : null}
              onChange={(newValue) =>
                onContractEndDateChange(
                  newValue ? newValue.format("YYYY-MM-DD") : ""
                )
              }
            />

            <DatePicker
              label="계약일"
              value={contractDate ? dayjs(contractDate) : null}
              onChange={(newValue) =>
                onContractDateChange(
                  newValue ? newValue.format("YYYY-MM-DD") : ""
                )
              }
            />
          </div>

          {status === "CANCELLED" && (
            <DatePicker
              label="계약 예상 종료일"
              value={
                expectedContractEndDate ? dayjs(expectedContractEndDate) : null
              }
              onChange={(newValue) =>
                onExpectedContractEndDateChange(
                  newValue ? newValue.format("YYYY-MM-DD") : ""
                )
              }
            />
          )}

          <StringSelect
            value={selectedPropertyUid}
            onChange={(e) => onSelectedPropertyUidChange(e.target.value)}
            label="매물 선택"
            size="medium"
            fullWidth
          >
            {propertyOptions.map((property) => (
              <MenuItem key={property.uid} value={property.uid.toString()}>
                {property.address}
              </MenuItem>
            ))}
          </StringSelect>

          {category && (
            <div className="grid grid-cols-[repeat(auto-fill)] gap-4">
              {category == ContractCategoryKeys.SALE && (
                <TextField
                  label="매매가"
                  value={price}
                  onChange={handlePriceChange}
                  onBlur={handlePriceBlur}
                  error={!!priceError}
                  helperText={priceError || formatKoreanPrice(price)}
                  fullWidth
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">만원</InputAdornment>
                    ),
                  }}
                />
              )}

              {category == ContractCategoryKeys.DEPOSIT && (
                <TextField
                  label="보증금"
                  value={deposit}
                  onChange={handleDepositChange}
                  onBlur={handleDepositBlur}
                  error={!!depositError}
                  helperText={depositError || formatKoreanPrice(deposit)}
                  fullWidth
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">만원</InputAdornment>
                    ),
                  }}
                />
              )}

              {category == ContractCategoryKeys.MONTHLY && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="보증금"
                    value={deposit}
                    onChange={handleDepositChange}
                    onBlur={handleDepositBlur}
                    error={!!depositError}
                    helperText={depositError || formatKoreanPrice(deposit)}
                    fullWidth
                    placeholder="0"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">만원</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="월세"
                    value={monthlyRent}
                    onChange={handleMonthlyRentChange}
                    onBlur={handleMonthlyRentBlur}
                    error={!!monthlyError}
                    helperText={monthlyError || formatKoreanPrice(monthlyRent)}
                    fullWidth
                    placeholder="0"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">만원</InputAdornment>
                      ),
                    }}
                  />
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <TextField
            label="기타"
            value={other}
            onChange={(e) => onOtherChange(e.target.value)}
            fullWidth
            placeholder="추가 정보를 입력하세요"
            minRows={5}
            multiline
            inputProps={{ maxLength: 255 }}
          />
        </div>
      </DialogContent>

      <DialogActions className="flex flex-row-reverse items-center justify-between p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            variant="outlined"
            color="info"
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitButtonDisabled || isLoading}
          >
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </div>
        {isSubmitButtonDisabled && (
          <Tooltip
            title={
              <div>
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            }
            arrow
            placement="top"
          >
            <div className="text-sm text-red-600 cursor-help">
              <ul className="list-disc list-inside">
                {validationErrors.slice(0, 1).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 1 && (
                  <li>외 {validationErrors.length - 1}개 항목</li>
                )}
              </ul>
            </div>
          </Tooltip>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ContractBasicInfoEditModalView;
