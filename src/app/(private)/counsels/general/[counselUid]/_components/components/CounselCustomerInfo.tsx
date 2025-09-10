import { Chip } from "@mui/material";
import { CUSTOMER_TYPE_COLORS } from "@/constants/customer";
import InfoField from "@/components/InfoField";

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
    <div className="card p-5">
      <h6 className="text-lg font-semibold text-primary mb-2">고객 정보</h6>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <InfoField label="고객명" value={customer.name} />
        <InfoField label="연락처" value={customer.phoneNo} />
        <InfoField label="선호 지역" value={customer.preferredRegion} />
        {(customer.minPrice || customer.maxPrice) && (
          <InfoField
            label="가격대"
            value={`${customer.minPrice?.toLocaleString() || "0"}원 ~ ${
              customer.maxPrice?.toLocaleString() || "제한없음"
            }원`}
          />
        )}
        {(customer.minDeposit || customer.maxDeposit) && (
          <InfoField
            label="보증금 범위"
            value={`${customer.minDeposit?.toLocaleString() || "0"}원 ~ ${
              customer.maxDeposit?.toLocaleString() || "제한없음"
            }원`}
          />
        )}
        {(customer.minRent || customer.maxRent) && (
          <InfoField
            label="월세 범위"
            value={`${customer.minRent?.toLocaleString() || "0"}원 ~ ${
              customer.maxRent?.toLocaleString() || "제한없음"
            }원`}
          />
        )}
        <InfoField
          label="고객 유형"
          value={
            <div className="flex gap-2 flex-wrap">
              {customer.tenant && (
                <Chip
                  label={CUSTOMER_TYPE_COLORS.tenant.label}
                  size="small"
                  sx={{
                    backgroundColor:
                      CUSTOMER_TYPE_COLORS.tenant.backgroundColor,
                    color: CUSTOMER_TYPE_COLORS.tenant.color,
                  }}
                />
              )}
              {customer.landlord && (
                <Chip
                  label={CUSTOMER_TYPE_COLORS.landlord.label}
                  size="small"
                  sx={{
                    backgroundColor:
                      CUSTOMER_TYPE_COLORS.landlord.backgroundColor,
                    color: CUSTOMER_TYPE_COLORS.landlord.color,
                  }}
                />
              )}
              {customer.buyer && (
                <Chip
                  label={CUSTOMER_TYPE_COLORS.buyer.label}
                  size="small"
                  sx={{
                    backgroundColor: CUSTOMER_TYPE_COLORS.buyer.backgroundColor,
                    color: CUSTOMER_TYPE_COLORS.buyer.color,
                  }}
                />
              )}
              {customer.seller && (
                <Chip
                  label={CUSTOMER_TYPE_COLORS.seller.label}
                  size="small"
                  sx={{
                    backgroundColor:
                      CUSTOMER_TYPE_COLORS.seller.backgroundColor,
                    color: CUSTOMER_TYPE_COLORS.seller.color,
                  }}
                />
              )}
              {!customer.seller &&
                !customer.landlord &&
                !customer.buyer &&
                !customer.tenant &&
                "-"}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CounselCustomerInfo;
export type { CustomerInfo };
