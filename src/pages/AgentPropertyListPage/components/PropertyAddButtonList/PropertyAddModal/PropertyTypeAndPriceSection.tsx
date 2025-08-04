import TextField from "@components/TextField";
import { RadioGroup, FormControlLabel, Radio, Checkbox } from "@mui/material";
import { PropertyType } from "@ts/property";
import { NumericInputResponse } from "@hooks/useNumericInput";

interface PropertyTypeData {
  type: PropertyType;
  realCategory: string;
  onTypeChange: (type: PropertyType) => void;
  onRealCategoryChange: (category: string) => void;
}

interface PriceInputs {
  price: NumericInputResponse;
  deposit: NumericInputResponse;
  monthlyRent: NumericInputResponse;
}

interface PropertyTypeAndPriceSectionProps {
  propertyTypeData: PropertyTypeData;
  priceInputs: PriceInputs;
  createContract: boolean;
  onCreateContractChange: (checked: boolean) => void;
}

const PropertyTypeAndPriceSection = ({
  propertyTypeData,
  priceInputs,
  createContract,
  onCreateContractChange,
}: PropertyTypeAndPriceSectionProps) => {
  const { type, realCategory, onTypeChange, onRealCategoryChange } =
    propertyTypeData;

  const {
    value: price,
    handleChange: onPriceChange,
    error: priceError,
    handleBlur: onPriceBlur,
  } = priceInputs.price;

  const {
    value: deposit,
    handleChange: onDepositChange,
    error: depositError,
    handleBlur: onDepositBlur,
  } = priceInputs.deposit;

  const {
    value: monthlyRent,
    handleChange: onMonthlyRentChange,
    error: monthlyRentError,
    handleBlur: onMonthlyRentBlur,
  } = priceInputs.monthlyRent;

  return (
    <div className="flex flex-col border-b border-gray-200 pb-7 mb-7 gap-5">
      <div>
        <h6 className="font-semibold">거래 유형</h6>
        <RadioGroup
          row
          value={type}
          onChange={(event) => onTypeChange(event.target.value as PropertyType)}
        >
          <FormControlLabel value="SALE" control={<Radio />} label="매매" />
          <FormControlLabel value="DEPOSIT" control={<Radio />} label="전세" />
          <FormControlLabel value="MONTHLY" control={<Radio />} label="월세" />
        </RadioGroup>
        {/* 조건부 가격 필드 */}
        {type === "SALE" && (
          <TextField
            label="매매 가격"
            value={price ?? ""}
            onChange={onPriceChange}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!priceError}
            helperText={priceError ?? undefined}
            onBlur={onPriceBlur}
          />
        )}
        {type === "DEPOSIT" && (
          <TextField
            label="보증금"
            value={deposit ?? ""}
            onChange={onDepositChange}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!depositError}
            helperText={depositError ?? undefined}
            onBlur={onDepositBlur}
          />
        )}
        {type === "MONTHLY" && (
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="보증금"
              value={deposit ?? ""}
              onChange={onDepositChange}
              fullWidth
              placeholder="숫자만 입력하세요"
              error={!!depositError}
              helperText={depositError ?? undefined}
              onBlur={onDepositBlur}
            />
            <TextField
              label="월세"
              value={monthlyRent ?? ""}
              onChange={onMonthlyRentChange}
              fullWidth
              placeholder="숫자만 입력하세요"
              error={!!monthlyRentError}
              helperText={monthlyRentError ?? undefined}
              onBlur={onMonthlyRentBlur}
            />
          </div>
        )}
      </div>

      <div>
        <h6 className="font-semibold">부동산 유형</h6>
        <RadioGroup
          row
          value={realCategory}
          onChange={(event) => onRealCategoryChange(event.target.value)}
        >
          <FormControlLabel value="ONE_ROOM" control={<Radio />} label="원룸" />
          <FormControlLabel value="TWO_ROOM" control={<Radio />} label="투룸" />
          <FormControlLabel
            value="APARTMENT"
            control={<Radio />}
            label="아파트"
          />
          <FormControlLabel value="VILLA" control={<Radio />} label="빌라" />
          <FormControlLabel value="HOUSE" control={<Radio />} label="주택" />
          <FormControlLabel
            value="OFFICETEL"
            control={<Radio />}
            label="오피스텔"
          />
          <FormControlLabel
            value="COMMERCIAL"
            control={<Radio />}
            label="상가"
          />
        </RadioGroup>
      </div>
      <FormControlLabel
        control={
          <Checkbox
            checked={createContract}
            onChange={(e) => onCreateContractChange(e.target.checked)}
          />
        }
        label="계약 자동 생성하기"
      />
    </div>
  );
};

export default PropertyTypeAndPriceSection;
