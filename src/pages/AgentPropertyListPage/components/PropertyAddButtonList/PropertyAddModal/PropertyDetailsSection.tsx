import TextField from "@components/TextField";
import { NumericInputResponse } from "@hooks/useNumericInput";

interface DetailInputs {
  netArea: NumericInputResponse;
  totalArea: NumericInputResponse;
  floor: NumericInputResponse;
  constructionYear: NumericInputResponse;
  parkingCapacity: NumericInputResponse;
}

const PropertyDetailsSection = ({
  detailInputs,
}: {
  detailInputs: DetailInputs;
}) => {
  const {
    value: netArea,
    handleChange: onNetAreaChange,
    error: netAreaError,
    handleBlur: onNetAreaBlur,
  } = detailInputs.netArea;

  const {
    value: totalArea,
    handleChange: onTotalAreaChange,
    error: totalAreaError,
    handleBlur: onTotalAreaBlur,
  } = detailInputs.totalArea;

  const {
    value: floor,
    handleChange: onFloorChange,
    error: floorError,
    handleBlur: onFloorBlur,
  } = detailInputs.floor;

  const {
    value: constructionYear,
    handleChange: onConstructionYearChange,
    error: constructionYearError,
    handleBlur: onConstructionYearBlur,
  } = detailInputs.constructionYear;

  const {
    value: parkingCapacity,
    handleChange: onParkingCapacityChange,
    error: parkingCapacityError,
    handleBlur: onParkingCapacityBlur,
  } = detailInputs.parkingCapacity;

  return (
    <div>
      <h5 className="text-lg font-bold mb-4">매물 정보</h5>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* 면적 정보 */}
          <TextField
            label="공급 면적(m²)"
            value={totalArea}
            onChange={onTotalAreaChange}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!totalAreaError}
            helperText={totalAreaError ?? undefined}
            required
            onBlur={onTotalAreaBlur}
          />
          <TextField
            label="전용 면적(m²)"
            value={netArea ?? ""}
            onChange={onNetAreaChange}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!netAreaError}
            helperText={netAreaError ?? undefined}
            required
            onBlur={onNetAreaBlur}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* 층수 */}
          <TextField
            label="층수"
            value={floor ?? ""}
            onChange={onFloorChange}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!floorError}
            helperText={floorError ?? undefined}
            onBlur={onFloorBlur}
          />

          {/* 건축년도 */}
          <TextField
            label="건축년도"
            value={constructionYear ?? ""}
            onChange={onConstructionYearChange}
            fullWidth
            placeholder="숫자만 입력하세요 ex)2010"
            error={!!constructionYearError}
            helperText={constructionYearError ?? undefined}
            onBlur={onConstructionYearBlur}
          />

          {/* 주차 가능 대수 */}
          <TextField
            label="주차 가능 대수"
            value={parkingCapacity}
            onChange={onParkingCapacityChange}
            fullWidth
            placeholder="숫자만 입력하세요"
            error={!!parkingCapacityError}
            helperText={parkingCapacityError ?? undefined}
            onBlur={onParkingCapacityBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
