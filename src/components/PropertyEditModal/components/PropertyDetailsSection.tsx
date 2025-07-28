import TextField from "@components/TextField";

interface PropertyDetailsSectionProps {
  totalArea: string;
  netArea: string;
  floor: string;
  onTotalAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNetAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyDetailsSection = ({
  totalArea,
  netArea,
  floor,
  onTotalAreaChange,
  onNetAreaChange,
  onFloorChange,
}: PropertyDetailsSectionProps) => {
  return (
    <>
      <TextField
        label="공급 면적"
        value={totalArea}
        onChange={onTotalAreaChange}
        className="mt-4"
        fullWidth
      />
      <TextField
        label="전용 면적"
        value={netArea}
        onChange={onNetAreaChange}
        className="mt-4"
        fullWidth
      />
      <TextField
        label="층수"
        value={floor}
        onChange={onFloorChange}
        className="mt-4"
        fullWidth
      />
    </>
  );
};

export default PropertyDetailsSection;
