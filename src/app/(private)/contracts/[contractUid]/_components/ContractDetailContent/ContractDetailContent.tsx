import {
  ContractDetail,
  ContractHistory,
  ContractPartyInfo,
} from "@/types/contract";
import { CONTRACT_STATUS_OPTION_LIST } from "@/constants/contract";
import ContractDetailContentView from "./ContractDetailContentView";
import { ERROR, INFO, PURPLE, SUCCESS, WARNING, TEXT } from "@/constants/colors";

const CONTRACT_STATUS_COLORS: Record<string, string> = {
  LISTED: TEXT.secondary,
  NEGOTIATING: INFO.dark,
  INTENT_SIGNED: WARNING.main,
  CANCELLED: ERROR.dark,
  CONTRACTED: SUCCESS.main,
  IN_PROGRESS: INFO.main,
  PAID_COMPLETE: PURPLE.main,
  REGISTERED: SUCCESS.text,
  MOVED_IN: SUCCESS.text,
  TERMINATED: ERROR.dark,
  CLOSED: TEXT.secondary,
};

interface Props {
  contract: ContractDetail;
  histories: ContractHistory[];
  onEditBasicInfo: () => void;
  onEditDocuments: () => void;
  onStatusChange?: (newStatus: "CANCELLED" | "TERMINATED") => void;
  onQuickStatusChange?: (newStatus: string) => void;
}

const ContractDetailContent = ({
  contract,
  histories,
  onEditBasicInfo,
  onEditDocuments,
  onStatusChange,
  onQuickStatusChange,
}: Props) => {
  const getStatusLabel = (statusValue: string): string => {
    const statusOption = CONTRACT_STATUS_OPTION_LIST.find(
      (option) => option.value === statusValue
    );
    return statusOption ? statusOption.label : statusValue;
  };

  const getStatusColor = (statusValue: string): string => {
    return CONTRACT_STATUS_COLORS[statusValue] || TEXT.secondary;
  };

  const getCustomerNamesDisplay = (contractPartyInfo: ContractPartyInfo[]) => {
    if (!contractPartyInfo || contractPartyInfo.length === 0) return "-";
    return contractPartyInfo.map((item) => item.name).join(", ");
  };

  return (
    <ContractDetailContentView
      contract={contract}
      histories={histories}
      getStatusLabel={getStatusLabel}
      getStatusColor={getStatusColor}
      getCustomerNamesDisplay={getCustomerNamesDisplay}
      onEditBasicInfo={onEditBasicInfo}
      onEditDocuments={onEditDocuments}
      onStatusChange={onStatusChange}
      onQuickStatusChange={onQuickStatusChange}
    />
  );
};

export default ContractDetailContent;
