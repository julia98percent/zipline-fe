import TextField from "@components/TextField";
import { NumericInputTuple } from "./PropertyAddModalView";

interface DetailInputs {
  netArea: NumericInputTuple;
  totalArea: NumericInputTuple;
  floor: NumericInputTuple;
  constructionYear: NumericInputTuple;
  parkingCapacity: NumericInputTuple;
}

interface PropertyDetailsSectionProps {
  detailInputs: DetailInputs;
}

const PropertyDetailsSection = ({
  detailInputs,
}: PropertyDetailsSectionProps) => {
  const [netArea, onNetAreaChange, netAreaError, , onNetAreaBlur] =
    detailInputs.netArea;
  const [totalArea, onTotalAreaChange, totalAreaError, , onTotalAreaBlur] =
    detailInputs.totalArea;
  const [floor, onFloorChange, floorError, , onFloorBlur] = detailInputs.floor;
  const [
    constructionYear,
    onConstructionYearChange,
    constructionYearError,
    ,
    onConstructionYearBlur,
  ] = detailInputs.constructionYear;
  const [
    parkingCapacity,
    onParkingCapacityChange,
    parkingCapacityError,
    ,
    onParkingCapacityBlur,
  ] = detailInputs.parkingCapacity;

  return (
    <>
      {/* 면적 정보 */}
      <TextField
        label="공급 면적(m²)"
        value={totalArea}
        onChange={onTotalAreaChange}
        className="mt-4"
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
        className="mt-4"
        fullWidth
        placeholder="숫자만 입력하세요"
        error={!!netAreaError}
        helperText={netAreaError ?? undefined}
        required
        onBlur={onNetAreaBlur}
      />

      {/* 층수 */}
      <TextField
        label="층수"
        value={floor ?? ""}
        onChange={onFloorChange}
        className="mt-4"
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
        className="mt-4"
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
        className="mt-4"
        fullWidth
        placeholder="숫자만 입력하세요"
        error={!!parkingCapacityError}
        helperText={parkingCapacityError ?? undefined}
        onBlur={onParkingCapacityBlur}
      />
    </>
  );
};

export default PropertyDetailsSection;
