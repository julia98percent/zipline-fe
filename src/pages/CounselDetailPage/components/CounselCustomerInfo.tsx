import { Typography, Box, Chip } from "@mui/material";
import styles from "../styles/CounselDetailPage.module.css";

interface CustomerInfo {
  uid: number;
  name: string;
  phoneNo: string;
  preferredRegion?: string;
  minPrice: number | null;
  maxPrice: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  minRent: number | null;
  maxRent: number | null;
  tenant: boolean;
  landlord: boolean;
  buyer: boolean;
  seller: boolean;
}

interface CounselCustomerInfoProps {
  customer: CustomerInfo;
}

const CounselCustomerInfo = ({ customer }: CounselCustomerInfoProps) => {
  return (
    <div className={styles.card}>
      <Typography className={styles.cardTitle}>고객 정보</Typography>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>고객명</span>
          <span className={styles.infoValue}>{customer.name}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>연락처</span>
          <span className={styles.infoValue}>{customer.phoneNo}</span>
        </div>
        {customer.preferredRegion && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>선호 지역</span>
            <span className={styles.infoValue}>{customer.preferredRegion}</span>
          </div>
        )}
        {(customer.minPrice || customer.maxPrice) && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>가격대</span>
            <span className={styles.infoValue}>
              {customer.minPrice?.toLocaleString() || "0"}원 ~{" "}
              {customer.maxPrice?.toLocaleString() || "제한없음"}원
            </span>
          </div>
        )}
        {(customer.minDeposit || customer.maxDeposit) && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>보증금 범위</span>
            <span className={styles.infoValue}>
              {customer.minDeposit?.toLocaleString() || "0"}원 ~{" "}
              {customer.maxDeposit?.toLocaleString() || "제한없음"}원
            </span>
          </div>
        )}
        {(customer.minRent || customer.maxRent) && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>월세 범위</span>
            <span className={styles.infoValue}>
              {customer.minRent?.toLocaleString() || "0"}원 ~{" "}
              {customer.maxRent?.toLocaleString() || "제한없음"}원
            </span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>고객 유형</span>
          <Box className="flex gap-2 flex-wrap">
            {customer.tenant && (
              <Chip label="임차인" size="small" variant="outlined" />
            )}
            {customer.landlord && (
              <Chip label="임대인" size="small" variant="outlined" />
            )}
            {customer.buyer && (
              <Chip label="매수인" size="small" variant="outlined" />
            )}
            {customer.seller && (
              <Chip label="매도인" size="small" variant="outlined" />
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default CounselCustomerInfo;
export type { CustomerInfo };
