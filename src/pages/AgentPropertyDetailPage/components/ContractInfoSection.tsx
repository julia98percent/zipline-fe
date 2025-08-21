import { Box, Typography } from "@mui/material";
import {
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "../styles/AgentPropertyDetailPage.styles";
import { ContractInfo } from "@apis/propertyService";
import { ContractCustomer } from "@apis/propertyService";
import dayjs from "dayjs";

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
    <InfoCard className="rounded-lg bg-white shadow-sm">
      <Typography className="text-xl font-semibold text-primary" gutterBottom>
        계약 정보
      </Typography>

      {!contractInfo || contractInfo?.contractUid === null ? (
        <Box className="flex justify-center items-center min-h-[200px]">
          <Typography color="text.secondary">첨부 문서 없음</Typography>
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
          {/* 계약 시작일 */}
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>계약 시작일</InfoLabel>
              <InfoValue>
                {contractInfo.contractStartDate
                  ? dayjs(contractInfo.contractStartDate).format("YYYY.MM.DD")
                  : "-"}
              </InfoValue>
            </InfoItem>
          </Box>

          {/* 계약 종료일 */}
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>계약 종료일</InfoLabel>
              <InfoValue>
                {contractInfo.contractEndDate
                  ? dayjs(contractInfo.contractEndDate).format("YYYY.MM.DD")
                  : "-"}
              </InfoValue>
            </InfoItem>
          </Box>

          {/* 계약일 */}
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>계약일</InfoLabel>
              <InfoValue>
                {contractInfo.contractDate
                  ? dayjs(contractInfo.contractDate).format("YYYY.MM.DD")
                  : "-"}
              </InfoValue>
            </InfoItem>
          </Box>

          {/* 임대인/매도인 */}
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>임대인/매도인</InfoLabel>
              <InfoValue>
                {getCustomerNames(contractInfo.customers, "LESSOR_OR_SELLER")}
              </InfoValue>
            </InfoItem>
          </Box>

          {/* 임차인/매수인 */}
          <Box width="calc(50% - 8px)">
            <InfoItem>
              <InfoLabel>임차인/매수인</InfoLabel>
              <InfoValue>
                {getCustomerNames(contractInfo.customers, "LESSEE_OR_BUYER")}
              </InfoValue>
            </InfoItem>
          </Box>
        </Box>
      )}
    </InfoCard>
  );
};

export default ContractInfoSection;
