import InfoField from "@components/InfoField";
import { Property, PropertyCategoryType } from "@ts/property";

interface CounselPropertyInfoProps {
  property: Property;
  PROPERTY_CATEGORIES: Record<PropertyCategoryType, string>;
}

const CounselPropertyInfo = ({
  property,
  PROPERTY_CATEGORIES,
}: CounselPropertyInfoProps) => {
  return (
    <div className="flex flex-col gap-2 p-5 card">
      <h6 className="text-lg font-semibold text-primary mb-2">부동산 정보</h6>
      <InfoField label="주소" value={property.address} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <InfoField
          label="부동산 유형"
          value={
            PROPERTY_CATEGORIES[property.type as PropertyCategoryType] ||
            property.type
          }
        />

        {property.price !== null && property.price > 0 && (
          <InfoField
            label="매매가"
            value={
              property.price ? `${property.price.toLocaleString()}원` : "-"
            }
          />
        )}
        {property.deposit !== null && property.deposit > 0 && (
          <InfoField
            label="보증금"
            value={
              property.deposit ? `${property.deposit.toLocaleString()}원` : "-"
            }
          />
        )}

        {property.monthlyRent !== null && property.monthlyRent > 0 && (
          <InfoField
            label="월세"
            value={
              property.monthlyRent
                ? `${property.monthlyRent.toLocaleString()}원`
                : "-"
            }
          />
        )}
        <InfoField label="전용면적" value={`${property.netArea}㎡`} />
        <InfoField label="공급면적" value={`${property.totalArea}㎡`} />
        <InfoField label="층수" value={`${property.floor}층`} />
        <InfoField
          label="건축년도"
          value={`${
            property.constructionYear ? property.constructionYear + "년" : "-"
          }`}
        />
        <InfoField
          label="엘리베이터"
          value={property.hasElevator ? "있음" : "없음"}
        />
        <InfoField label="주차 대수" value={`${property.parkingCapacity}대`} />
        <InfoField
          label="반려동물"
          value={property.petsAllowed ? "가능" : "불가능"}
        />
        <InfoField label="설명" value={property.details || "-"} />
      </div>
    </div>
  );
};

export default CounselPropertyInfo;
