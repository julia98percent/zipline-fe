import { Chip } from "@mui/material";
import { AgentPropertyDetail } from "@apis/propertyService";
import {
  getPropertyTypeColors,
  getPropertyCategoryColors,
} from "@constants/property";
import { formatKoreanPrice } from "@utils/numberUtil";
import InfoField from "@components/InfoField";

interface PropertyInfoSectionProps {
  property: AgentPropertyDetail;
}

const PropertyInfoSection = ({ property }: PropertyInfoSectionProps) => {
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      ONE_ROOM: "원룸",
      TWO_ROOM: "투룸",
      APARTMENT: "아파트",
      VILLA: "빌라",
      HOUSE: "주택",
      OFFICETEL: "오피스텔",
      COMMERCIAL: "상가",
    };
    return categories[category] || category;
  };

  const getTransactionType = (type: string) => {
    const types: { [key: string]: string } = {
      SALE: "매매",
      DEPOSIT: "전세",
      MONTHLY: "월세",
    };
    return types[type] || type;
  };

  const getTypeChipColor = (type: string) => {
    return getPropertyTypeColors(type).background;
  };

  const getTypeTextColor = (type: string) => {
    return getPropertyTypeColors(type).text;
  };

  const getCategoryChipColor = (category: string) => {
    return getPropertyCategoryColors(category).background;
  };

  const getCategoryTextColor = (category: string) => {
    return getPropertyCategoryColors(category).text;
  };

  const formatPrice = (price: number | null) => {
    return price ? formatKoreanPrice(price) : "-";
  };

  return (
    <div className="card p-5">
      <h6 className="text-lg font-semibold text-primary mb-2">매물 정보</h6>

      <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2">
        <InfoField label="고객명" value={property.customer || "-"} />

        <InfoField
          label="거래 유형"
          value={
            <Chip
              label={getTransactionType(property.type)}
              size="small"
              className="flex w-min font-medium text-sm"
              sx={{
                backgroundColor: getTypeChipColor(property.type),
                color: getTypeTextColor(property.type),
              }}
            />
          }
        />

        <InfoField
          label="매물 종류"
          value={
            <Chip
              label={getCategoryName(property.realCategory)}
              size="small"
              className="flex w-min font-medium text-sm"
              sx={{
                backgroundColor: getCategoryChipColor(property.realCategory),
                color: getCategoryTextColor(property.realCategory),
              }}
            />
          }
        />

        {property.type === "SALE" && (
          <InfoField label="매매가" value={formatPrice(property.price)} />
        )}

        {property.type === "DEPOSIT" && (
          <InfoField label="보증금" value={formatPrice(property.deposit)} />
        )}

        {property.type === "MONTHLY" && (
          <>
            <InfoField label="보증금" value={formatPrice(property.deposit)} />
            <InfoField label="월세" value={formatPrice(property.monthlyRent)} />
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyInfoSection;
