import { Slider } from "@mui/material";
import Button from "@/components/Button";
import {
  formatPrice,
  getPriceValueLabelFormat,
  MAX_PRICE_SLIDER_VALUE,
  MAX_MONTHLY_RENT_SLIDER_VALUE,
  FILTER_DEFAULTS_MIN,
  FILTER_DEFAULTS,
} from "@/utils/filterUtil";

interface PriceRangeSectionProps {
  category: string;
  priceRange: number[];
  depositRange: number[];
  rentRange: number[];
  handlePriceRangeChange: (newValue: number | number[]) => void;
  handleDepositRangeChange: (newValue: number | number[]) => void;
  handleRentRangeChange: (newValue: number | number[]) => void;
}

export default function PriceRangeSection({
  category,
  priceRange,
  depositRange,
  rentRange,
  handlePriceRangeChange,
  handleDepositRangeChange,
  handleRentRangeChange,
}: PriceRangeSectionProps) {
  const priceValueLabelFormat = (value: number) =>
    getPriceValueLabelFormat(value, FILTER_DEFAULTS.PRICE_MAX, "20억원~");
  const monthlyRentValueLabelFormat = (value: number) =>
    getPriceValueLabelFormat(
      value,
      FILTER_DEFAULTS.MONTHLY_RENT_MAX,
      "500만원~"
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h6 className="font-semibold">가격 범위</h6>
        <Button
          variant="text"
          onClick={() => {
            handlePriceRangeChange([
              FILTER_DEFAULTS_MIN,
              MAX_PRICE_SLIDER_VALUE,
            ]);
            handleDepositRangeChange([
              FILTER_DEFAULTS_MIN,
              MAX_PRICE_SLIDER_VALUE,
            ]);
            handleRentRangeChange([
              FILTER_DEFAULTS_MIN,
              MAX_MONTHLY_RENT_SLIDER_VALUE,
            ]);
          }}
          className="p-0!"
        >
          초기화
        </Button>
      </div>

      <div className="mx-4">
        {(category === "" || category === "SALE") && (
          <>
            <p className="text-sm mb-2 text-gray-600">
              매매가: {formatPrice(priceRange[0] || FILTER_DEFAULTS_MIN)} -{" "}
              {(priceRange[1] || FILTER_DEFAULTS.PRICE_MAX) >
              FILTER_DEFAULTS.PRICE_MAX
                ? "20억원~"
                : formatPrice(priceRange[1] || FILTER_DEFAULTS.PRICE_MAX)}
            </p>
            <Slider
              value={[
                priceRange[0] || FILTER_DEFAULTS_MIN,
                priceRange[1] || FILTER_DEFAULTS.PRICE_MAX,
              ]}
              onChange={(_, newValue) => handlePriceRangeChange(newValue)}
              valueLabelDisplay="auto"
              min={FILTER_DEFAULTS_MIN}
              max={MAX_PRICE_SLIDER_VALUE}
              step={1000}
              valueLabelFormat={priceValueLabelFormat}
              className="mb-4"
            />
          </>
        )}

        {(category === "" ||
          category === "DEPOSIT" ||
          category === "MONTHLY") && (
          <>
            <p className="text-sm mb-2 text-gray-600">
              보증금: {formatPrice(depositRange[0] || FILTER_DEFAULTS_MIN)} -{" "}
              {(depositRange[1] || FILTER_DEFAULTS.DEPOSIT_MAX) >
              FILTER_DEFAULTS.DEPOSIT_MAX
                ? "20억원~"
                : formatPrice(depositRange[1] || FILTER_DEFAULTS.DEPOSIT_MAX)}
            </p>
            <Slider
              value={[
                depositRange[0] || FILTER_DEFAULTS_MIN,
                depositRange[1] || FILTER_DEFAULTS.DEPOSIT_MAX,
              ]}
              onChange={(_, newValue) => handleDepositRangeChange(newValue)}
              valueLabelDisplay="auto"
              step={1000}
              min={0}
              max={MAX_PRICE_SLIDER_VALUE}
              valueLabelFormat={priceValueLabelFormat}
              className="mb-4"
            />
          </>
        )}

        {/* 월세 - 전체 또는 월세일 때만 표시 */}
        {(category === "" || category === "MONTHLY") && (
          <>
            <p className="text-sm mb-2 text-gray-600">
              월세: {formatPrice(rentRange[0] || FILTER_DEFAULTS_MIN)} -{" "}
              {(rentRange[1] || FILTER_DEFAULTS.MONTHLY_RENT_MAX) >
              FILTER_DEFAULTS.MONTHLY_RENT_MAX
                ? "500만원~"
                : formatPrice(rentRange[1] || FILTER_DEFAULTS.MONTHLY_RENT_MAX)}
            </p>
            <Slider
              value={[
                rentRange[0] || FILTER_DEFAULTS_MIN,
                rentRange[1] || FILTER_DEFAULTS.MONTHLY_RENT_MAX,
              ]}
              onChange={(_, newValue) => handleRentRangeChange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={MAX_MONTHLY_RENT_SLIDER_VALUE}
              valueLabelFormat={monthlyRentValueLabelFormat}
            />
          </>
        )}
      </div>
    </div>
  );
}
