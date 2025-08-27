import { ContractInfo } from "@apis/propertyService";
import { ContractCustomer } from "@apis/propertyService";
import dayjs from "dayjs";
import InfoField from "@components/InfoField";

interface ContractInfoSectionProps {
  contractInfo: ContractInfo | null;
}

const ContractInfoSection = ({ contractInfo }: ContractInfoSectionProps) => {
  const getCustomerNames = (
    customers: ContractCustomer[],
    role: ContractCustomer["customerRole"]
  ) => {
    const names = customers
      .filter((c) => c.customerRole === role)
      .map((c) => c.customerName);
    if (names.length === 0) return "-";
    return names.join(", ");
  };

  return (
    <div className="card p-5">
      <h6 className="text-lg font-semibold text-primary mb-2">계약 정보</h6>

      {!contractInfo || contractInfo?.contractUid === null ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-neutral-500">첨부 문서 없음</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2">
          <InfoField
            label="계약 시작일"
            value={
              contractInfo.contractStartDate
                ? dayjs(contractInfo.contractStartDate).format("YYYY.MM.DD")
                : "-"
            }
          />
          <InfoField
            label="계약 종료일"
            value={
              contractInfo.contractEndDate
                ? dayjs(contractInfo.contractEndDate).format("YYYY.MM.DD")
                : "-"
            }
          />
          <InfoField
            label="계약일"
            value={
              contractInfo.contractDate
                ? dayjs(contractInfo.contractDate).format("YYYY.MM.DD")
                : "-"
            }
          />
          <InfoField
            label="임대인/매도인"
            value={getCustomerNames(contractInfo.customers, "LESSOR_OR_SELLER")}
          />
          <InfoField
            label="임차인/매수인"
            value={getCustomerNames(contractInfo.customers, "LESSEE_OR_BUYER")}
          />
        </div>
      )}
    </div>
  );
};

export default ContractInfoSection;
