import { Typography } from "@mui/material";
import styles from "../styles/CounselDetailPage.module.css";
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
    <div className={styles.card}>
      <Typography className={styles.cardTitle}>부동산 정보</Typography>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>주소</span>
          <span className={styles.infoValue}>{property.address}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>부동산 유형</span>
          <span className={styles.infoValue}>
            {PROPERTY_CATEGORIES[property.type as PropertyCategoryType] ||
              property.type}
          </span>
        </div>
        {property.price && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>매매가</span>
            <span className={styles.infoValue}>
              {property.price.toLocaleString()}원
            </span>
          </div>
        )}
        {property.deposit !== null && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>보증금</span>
            <span className={styles.infoValue}>
              {property.deposit.toLocaleString()}원
            </span>
          </div>
        )}
        {property.monthlyRent !== null && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>월세</span>
            <span className={styles.infoValue}>
              {property.monthlyRent.toLocaleString()}원
            </span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>전용면적</span>
          <span className={styles.infoValue}>{property.netArea}㎡</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>공급면적</span>
          <span className={styles.infoValue}>{property.totalArea}㎡</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>층수</span>
          <span className={styles.infoValue}>{property.floor}층</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>건축년도</span>
          <span className={styles.infoValue}>
            {property.constructionYear}년
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>엘리베이터</span>
          <span className={styles.infoValue}>
            {property.hasElevator ? "있음" : "없음"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>주차 대수</span>
          <span className={styles.infoValue}>{property.parkingCapacity}대</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>반려동물</span>
          <span className={styles.infoValue}>
            {property.hasPet ? "가능" : "불가능"}
          </span>
        </div>
        {property.description && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>설명</span>
            <span className={styles.infoValue}>{property.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselPropertyInfo;
export type { PropertyInfo };
