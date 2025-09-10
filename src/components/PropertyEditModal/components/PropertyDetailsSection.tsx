import TextField from "@/components/TextField";

interface PropertyDetailsSectionProps {
  totalArea: string;
  netArea: string;
  floor: string;
  constructionYear: string;
  onTotalAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNetAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConstructionYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyDetailsSection = ({
  totalArea,
  netArea,
  floor,
  onTotalAreaChange,
  onNetAreaChange,
  onFloorChange,
  constructionYear,
  onConstructionYearChange,
}: PropertyDetailsSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 card">
      <TextField
        label="공급 면적"
        value={totalArea}
        onChange={onTotalAreaChange}
        fullWidth
      />
      <TextField
        label="전용 면적"
        value={netArea}
        onChange={onNetAreaChange}
        fullWidth
      />

      <TextField
        label="층수"
        value={floor}
        onChange={onFloorChange}
        fullWidth
      />
      <TextField
        label="건축년도"
        value={constructionYear}
        onChange={onConstructionYearChange}
        fullWidth
        placeholder="2010"
        inputProps={{ maxLength: 4 }}
      />
    </div>
  );
};

export default PropertyDetailsSection;
