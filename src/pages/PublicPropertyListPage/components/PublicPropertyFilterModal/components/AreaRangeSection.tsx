import { Slider } from "@mui/material";
import Button from "@components/Button";
import {
  AREA_STEP,
  FILTER_DEFAULTS,
  FILTER_DEFAULTS_MIN,
} from "@utils/filterUtil";
interface AreaRangeSectionProps {
  netAreaRange: number[];
  totalAreaRange: number[];
  handleNetAreaRangeChange: (newValue: number | number[]) => void;
  handleTotalAreaRangeChange: (newValue: number | number[]) => void;
}

export default function AreaRangeSection({
  netAreaRange,
  totalAreaRange,
  handleNetAreaRangeChange,
  handleTotalAreaRangeChange,
}: AreaRangeSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h6 className="font-semibold">면적 범위</h6>
        <Button
          variant="text"
          onClick={() => {
            handleNetAreaRangeChange([
              FILTER_DEFAULTS_MIN,
              FILTER_DEFAULTS.NET_AREA_MAX,
            ]);
            handleTotalAreaRangeChange([
              FILTER_DEFAULTS_MIN,
              FILTER_DEFAULTS.TOTAL_AREA_MAX,
            ]);
          }}
          className="p-0!"
        >
          초기화
        </Button>
      </div>
      <div className="mx-4">
        <p className="text-sm mb-2 text-gray-600">
          전용 면적: {netAreaRange[0]}m² -{" "}
          {netAreaRange[1] === FILTER_DEFAULTS.NET_AREA_MAX
            ? `${netAreaRange[1]}m²~`
            : `${netAreaRange[1]}m²`}
        </p>
        <Slider
          value={netAreaRange}
          onChange={(_, newValue) => handleNetAreaRangeChange(newValue)}
          min={FILTER_DEFAULTS_MIN}
          max={FILTER_DEFAULTS.NET_AREA_MAX}
          step={AREA_STEP}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) =>
            value === FILTER_DEFAULTS.NET_AREA_MAX
              ? `${value}m²~`
              : `${value}m²`
          }
        />
      </div>

      <div className="mx-4 mb-6">
        <p className="text-sm mb-2 text-gray-600">
          공급 면적: {totalAreaRange[0]}m² -{" "}
          {totalAreaRange[1] === FILTER_DEFAULTS.TOTAL_AREA_MAX
            ? `${totalAreaRange[1]}m²~`
            : `${totalAreaRange[1]}m²`}
        </p>
        <Slider
          value={totalAreaRange}
          onChange={(_, newValue) => handleTotalAreaRangeChange(newValue)}
          min={FILTER_DEFAULTS_MIN}
          max={FILTER_DEFAULTS.TOTAL_AREA_MAX}
          step={AREA_STEP}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) =>
            value === FILTER_DEFAULTS.TOTAL_AREA_MAX
              ? `${value}m²~`
              : `${value}m²`
          }
        />
      </div>
    </div>
  );
}
