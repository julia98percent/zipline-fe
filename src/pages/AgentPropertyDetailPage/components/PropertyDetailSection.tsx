import { AgentPropertyDetail } from "@apis/propertyService";
import InfoField from "@components/InfoField";

interface PropertyDetailSectionProps {
  property: AgentPropertyDetail;
}

const PropertyDetailSection = ({ property }: PropertyDetailSectionProps) => {
  const formatValue = (
    value: number | null | undefined,
    suffix: string = ""
  ) => {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return `${value}${suffix}`;
  };

  const formatConstructionYear = (year: string | null | undefined) => {
    if (!year || year.trim() === "") return "-";
    const numYear = Number(year);
    if (isNaN(numYear) || numYear <= 0) return "-";
    return `${numYear}년`;
  };

  return (
    <div className="card p-5">
      <h6 className="text-xl font-semibold text-primary mb-2">매물 세부정보</h6>

      <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2">
        <InfoField
          label="공급 면적"
          value={formatValue(property.totalArea, "m²")}
        />
        <InfoField
          label="전용 면적"
          value={formatValue(property.netArea, "m²")}
        />

        <InfoField label="층수" value={formatValue(property.floor, "층")} />

        <InfoField
          label="건축년도"
          value={formatConstructionYear(property.constructionYear)}
        />
      </div>
    </div>
  );
};

export default PropertyDetailSection;
