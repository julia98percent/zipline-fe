import { Slider } from "@mui/material";
import Button from "@components/Button";
import {
  formatPrice,
  getPriceValueLabelFormat,
  MAX_PRICE_SLIDER_VALUE,
  MAX_MONTHLY_RENT_SLIDER_VALUE,
  FILTER_DEFAULTS_MIN,
  FILTER_DEFAULTS,
} from "@utils/filterUtil";

interface PriceRangeSectionProps {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minDeposit?: number;
  maxDeposit?: number;
  minMonthlyRent?: number;
  maxMonthlyRent?: number;
  onSliderChange: (
    field: string
  ) => (_: Event, newValue: number | number[]) => void;
}

export default function PriceRangeSection({
  category,
  minPrice,
  maxPrice,
  minDeposit,
  maxDeposit,
  minMonthlyRent,
  maxMonthlyRent,
  onSliderChange,
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
            onSliderChange("Price")(null as any, [
              FILTER_DEFAULTS_MIN,
              FILTER_DEFAULTS.PRICE_MAX,
            ]);
            onSliderChange("Deposit")(null as any, [
              FILTER_DEFAULTS_MIN,
              FILTER_DEFAULTS.DEPOSIT_MAX,
            ]);
            onSliderChange("MonthlyRent")(null as any, [
              FILTER_DEFAULTS_MIN,
              FILTER_DEFAULTS.MONTHLY_RENT_MAX,
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
              매매가: {formatPrice(minPrice || FILTER_DEFAULTS_MIN)} -{" "}
              {(maxPrice || FILTER_DEFAULTS.PRICE_MAX) >
              FILTER_DEFAULTS.PRICE_MAX
                ? "20억원~"
                : formatPrice(maxPrice || FILTER_DEFAULTS.PRICE_MAX)}
            </p>
            <Slider
              value={[
                minPrice || FILTER_DEFAULTS_MIN,
                maxPrice || FILTER_DEFAULTS.PRICE_MAX,
              ]}
              onChange={onSliderChange("Price")}
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
              보증금: {formatPrice(minDeposit || FILTER_DEFAULTS_MIN)} -{" "}
              {(maxDeposit || FILTER_DEFAULTS.DEPOSIT_MAX) >
              FILTER_DEFAULTS.DEPOSIT_MAX
                ? "20억원~"
                : formatPrice(maxDeposit || FILTER_DEFAULTS.DEPOSIT_MAX)}
            </p>
            <Slider
              value={[
                minDeposit || FILTER_DEFAULTS_MIN,
                maxDeposit || FILTER_DEFAULTS.DEPOSIT_MAX,
              ]}
              onChange={onSliderChange("Deposit")}
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
              월세: {formatPrice(minMonthlyRent || FILTER_DEFAULTS_MIN)} -{" "}
              {(maxMonthlyRent || FILTER_DEFAULTS.MONTHLY_RENT_MAX) >
              FILTER_DEFAULTS.MONTHLY_RENT_MAX
                ? "500만원~"
                : formatPrice(
                    maxMonthlyRent || FILTER_DEFAULTS.MONTHLY_RENT_MAX
                  )}
            </p>
            <Slider
              value={[
                minMonthlyRent || FILTER_DEFAULTS_MIN,
                maxMonthlyRent || FILTER_DEFAULTS.MONTHLY_RENT_MAX,
              ]}
              onChange={onSliderChange("MonthlyRent")}
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
