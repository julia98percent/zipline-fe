import TextField from "@components/TextField";
import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { PropertyType } from "@ts/property";
import { NumericInputTuple } from "./PropertyAddModalView";

interface PropertyTypeData {
  type: PropertyType;
  realCategory: string;
  onTypeChange: (type: PropertyType) => void;
  onRealCategoryChange: (category: string) => void;
}

interface PriceInputs {
  price: NumericInputTuple;
  deposit: NumericInputTuple;
  monthlyRent: NumericInputTuple;
}

interface PropertyTypeAndPriceSectionProps {
  propertyTypeData: PropertyTypeData;
  priceInputs: PriceInputs;
}

const PropertyTypeAndPriceSection = ({
  propertyTypeData,
  priceInputs,
}: PropertyTypeAndPriceSectionProps) => {
  const { type, realCategory, onTypeChange, onRealCategoryChange } =
    propertyTypeData;

  const [price, onPriceChange, priceError, , onPriceBlur] = priceInputs.price;
  const [deposit, onDepositChange, depositError, , onDepositBlur] =
    priceInputs.deposit;
  const [
    monthlyRent,
    onMonthlyRentChange,
    monthlyRentError,
    ,
    onMonthlyRentBlur,
  ] = priceInputs.monthlyRent;

  return (
    <>
      {/* 거래 유형 */}
      <Typography variant="subtitle1" className="mt-4">
        거래 유형
      </Typography>
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
          className="mt-4"
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
          className="mt-4"
          fullWidth
          placeholder="숫자만 입력하세요"
          error={!!depositError}
          helperText={depositError ?? undefined}
          onBlur={onDepositBlur}
        />
      )}
      {type === "MONTHLY" && (
        <>
          <TextField
            label="보증금"
            value={deposit ?? ""}
            onChange={onDepositChange}
            className="mt-4"
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
            className="mt-4"
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!monthlyRentError}
            helperText={monthlyRentError ?? undefined}
            onBlur={onMonthlyRentBlur}
          />
        </>
      )}

      {/* 부동산 유형 */}
      <Typography variant="subtitle1" className="mt-4">
        부동산 유형 선택
      </Typography>
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
        <FormControlLabel value="COMMERCIAL" control={<Radio />} label="상가" />
      </RadioGroup>
    </>
  );
};

export default PropertyTypeAndPriceSection;
