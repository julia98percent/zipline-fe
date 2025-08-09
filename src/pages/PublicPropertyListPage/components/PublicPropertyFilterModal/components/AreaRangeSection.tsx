import { Slider } from "@mui/material";
import Button from "@components/Button";
import {
  AREA_STEP,
  FILTER_DEFAULTS,
  FILTER_DEFAULTS_MIN,
} from "@utils/filterUtil";
interface AreaRangeSectionProps {
  minNetArea: number;
  maxNetArea: number;
  minTotalArea: number;
  maxTotalArea: number;
  onSliderChange: (
    field: string
  ) => (_: Event, newValue: number | number[]) => void;
}

export default function AreaRangeSection({
  minNetArea,
  maxNetArea,
  minTotalArea,
  maxTotalArea,
  onSliderChange,
}: AreaRangeSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h6 className="font-semibold">면적 범위</h6>
        <Button variant="text" className="p-0!">
          초기화
        </Button>
      </div>
      <div className="mx-4">
        <p className="text-sm mb-2 text-gray-600">
          전용 면적: {minNetArea}m² -{" "}
          {maxNetArea === FILTER_DEFAULTS.NET_AREA_MAX
            ? `${maxNetArea}m²~`
            : `${maxNetArea}m²`}
        </p>
        <Slider
          value={[minNetArea, maxNetArea]}
          onChange={onSliderChange("NetArea")}
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
          공급 면적: {minTotalArea}m² -{" "}
          {maxTotalArea === FILTER_DEFAULTS.TOTAL_AREA_MAX
            ? `${maxTotalArea}m²~`
            : `${maxTotalArea}m²`}
        </p>
        <Slider
          value={[minTotalArea, maxTotalArea]}
          onChange={onSliderChange("TotalArea")}
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
