import InfoField from "@components/InfoField";

interface PropertyDetailsSectionProps {
  details: string;
}

const PropertyDetailsSection = ({ details }: PropertyDetailsSectionProps) => {
  return (
    <div className="card p-5">
      <h6 className="text-xl font-semibold text-primary mb-2">특이 사항</h6>
      <InfoField value={details || "-"} />
    </div>
  );
};

export default PropertyDetailsSection;
